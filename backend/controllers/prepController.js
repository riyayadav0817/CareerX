const Question = require('../models/Question');
const PracticeAttempt = require('../models/PracticeAttempt');
const MockTest = require('../models/MockTest');
const TestAttempt = require('../models/TestAttempt');
const CodingProblem = require('../models/CodingProblem');
const CodingSubmission = require('../models/CodingSubmission');
const PrepProgress = require('../models/PrepProgress');
const CompanyTrack = require('../models/CompanyTrack');
const { runCodeSecurely } = require('../services/codeRunner');

// Helper to get or initialize prep progress
async function getOrCreateProgress(userId) {
  if (!userId) return null;
  let progress = await PrepProgress.findOne({ user: userId });
  if (!progress) {
    progress = await PrepProgress.create({
      user: userId,
      streakDays: 1,
      lastActiveDate: new Date(),
      upcomingGoals: [
        { title: 'Complete 25 Aptitude Questions', targetDate: new Date(Date.now() + 7 * 86400000), isCompleted: false },
        { title: 'Score 80%+ in TCS NQT Mock Test', targetDate: new Date(Date.now() + 10 * 86400000), isCompleted: false },
        { title: 'Solve 10 Array & String Coding Problems', targetDate: new Date(Date.now() + 14 * 86400000), isCompleted: false },
      ],
    });
  } else {
    // Check streak
    const now = new Date();
    const last = new Date(progress.lastActiveDate);
    const diffHours = (now - last) / (1000 * 60 * 60);
    if (diffHours >= 24 && diffHours < 48) {
      progress.streakDays += 1;
      progress.lastActiveDate = now;
      await progress.save();
    } else if (diffHours >= 48) {
      progress.streakDays = 1;
      progress.lastActiveDate = now;
      await progress.save();
    }
  }
  return progress;
}

// @desc    Get Placement Prep Dashboard Analytics
// @route   GET /api/prep/dashboard
// @access  Public / Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?._id;
    let progress = await getOrCreateProgress(userId);
    const today = new Date().toISOString().split('T')[0];

    let stats;
    let recentTests = [];
    let recentAttempts = [];

    if (progress) {
      // Reset daily challenge if date rolled over
      if (progress.dailyChallenge && progress.dailyChallenge.date !== today) {
        progress.dailyChallenge = {
          date: today,
          targetQuestions: progress.dailyChallenge.targetQuestions || 5,
          completedQuestions: 0,
          isCompleted: false,
        };
        await progress.save();
      }

      // Compute weak topics dynamically from user's practice attempts
      const topicAgg = await PracticeAttempt.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$topic',
            attempted: { $sum: 1 },
            correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          },
        },
        {
          $project: {
            topic: '$_id',
            attempted: 1,
            correct: 1,
            accuracy: { $multiply: [{ $divide: ['$correct', '$attempted'] }, 100] },
          },
        },
        { $match: { accuracy: { $lt: 75 } } },
        { $sort: { accuracy: 1, attempted: -1 } },
        { $limit: 5 },
      ]);

      const computedWeakTopics = topicAgg.map((t) => t.topic);
      if (computedWeakTopics.length > 0 || progress.completedQuestionsCount > 0) {
        progress.weakTopics = computedWeakTopics;
        await progress.save();
      }

      const completed = progress.completedQuestionsCount ?? 0;
      const correct = progress.correctQuestionsCount ?? 0;

      stats = {
        isGuest: false,
        streakDays: progress.streakDays ?? 1,
        completedQuestionsCount: completed,
        correctQuestionsCount: correct,
        accuracyPercentage: completed > 0 ? Math.round((correct / completed) * 100) : 0,
        categoryStats: progress.categoryStats || {
          aptitude: { attempted: 0, correct: 0 },
          reasoning: { attempted: 0, correct: 0 },
          verbal: { attempted: 0, correct: 0 },
          coreCs: { attempted: 0, correct: 0 },
          coding: { solved: 0, attempted: 0 },
        },
        weakTopics: progress.weakTopics || [],
        dailyChallenge: progress.dailyChallenge || {
          date: today,
          targetQuestions: 5,
          completedQuestions: 0,
          isCompleted: false,
        },
        upcomingGoals: progress.upcomingGoals || [],
      };

      recentTests = await TestAttempt.find({ user: userId })
        .populate('mockTest', 'title category totalMarks durationMinutes')
        .sort({ createdAt: -1 })
        .limit(5);

      recentAttempts = await PracticeAttempt.find({ user: userId })
        .populate('question', 'title category topic difficulty')
        .sort({ createdAt: -1 })
        .limit(5);
    } else {
      // Guest / unauthenticated visitor: return clean zeroed state
      stats = {
        isGuest: true,
        streakDays: 0,
        completedQuestionsCount: 0,
        correctQuestionsCount: 0,
        accuracyPercentage: 0,
        categoryStats: {
          aptitude: { attempted: 0, correct: 0 },
          reasoning: { attempted: 0, correct: 0 },
          verbal: { attempted: 0, correct: 0 },
          coreCs: { attempted: 0, correct: 0 },
          coding: { solved: 0, attempted: 0 },
        },
        weakTopics: [],
        dailyChallenge: {
          date: today,
          targetQuestions: 5,
          completedQuestions: 0,
          isCompleted: false,
        },
        upcomingGoals: [
          { title: 'Complete 25 Aptitude Questions', targetDate: new Date(Date.now() + 7 * 86400000), isCompleted: false },
          { title: 'Score 80%+ in TCS NQT Mock Test', targetDate: new Date(Date.now() + 10 * 86400000), isCompleted: false },
          { title: 'Solve 10 Array & String Coding Problems', targetDate: new Date(Date.now() + 14 * 86400000), isCompleted: false },
        ],
      };
    }

    // Fetch a real daily challenge question from DB
    const dailyQuestion = await Question.findOne({ category: 'aptitude' })
      .select('title question category topic difficulty')
      .lean();

    // Recommended topics
    const recommendedTopics = [
      { name: 'Time, Speed and Distance', category: 'aptitude', questionsCount: 15, difficulty: 'Medium' },
      { name: 'Syllogisms & Deductions', category: 'reasoning', questionsCount: 12, difficulty: 'Medium' },
      { name: 'Reading Comprehension', category: 'verbal', questionsCount: 10, difficulty: 'Hard' },
      { name: 'Binary Trees & Traversal', category: 'coding', questionsCount: 8, difficulty: 'Medium' },
      { name: 'DBMS Indexing & Transactions', category: 'core-cs', questionsCount: 14, difficulty: 'Medium' },
    ];

    const payload = {
      ...stats,
      dailyQuestion,
      recentTests,
      recentAttempts,
      recommendedTopics,
    };

    res.status(200).json({
      success: true,
      data: payload,
      stats: payload,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Questions by Category and Topic
// @route   GET /api/prep/questions
// @access  Public
exports.getQuestions = async (req, res) => {
  try {
    const { category, topic, difficulty, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (topic && topic !== 'all') {
      query.topic = new RegExp(`^${topic.trim()}$`, 'i');
    }
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (search && search.trim()) {
      query.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { question: new RegExp(search.trim(), 'i') },
        { topic: new RegExp(search.trim(), 'i') },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      questions,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get list of topics with question count for a category
// @route   GET /api/prep/topics/:category
// @access  Public
exports.getTopicsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const topics = await Question.aggregate([
      { $match: { category } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      topics: topics.map((t) => ({ name: t._id, count: t.count })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit Practice Answer (with immediate feedback)
// @route   POST /api/prep/practice-attempt
// @access  Private / Optional
exports.submitPracticeAnswer = async (req, res) => {
  try {
    const { questionId, selectedOption, timeSpentSeconds = 0 } = req.body;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const isCorrect = question.correctOption.toUpperCase() === selectedOption.toUpperCase();

    if (req.user?._id) {
      // Record attempt
      await PracticeAttempt.create({
        user: req.user._id,
        question: question._id,
        category: question.category,
        topic: question.topic,
        selectedOption,
        isCorrect,
        timeSpentSeconds,
      });

      // Update progress
      const progress = await getOrCreateProgress(req.user._id);
      if (progress) {
        progress.completedQuestionsCount += 1;
        if (isCorrect) progress.correctQuestionsCount += 1;

        // Update category stats
        const catKey = question.category === 'core-cs' ? 'coreCs' : question.category;
        if (progress.categoryStats && progress.categoryStats[catKey]) {
          progress.categoryStats[catKey].attempted += 1;
          if (isCorrect) progress.categoryStats[catKey].correct += 1;
        }

        // Daily challenge update
        if (progress.dailyChallenge) {
          progress.dailyChallenge.completedQuestions += 1;
          if (progress.dailyChallenge.completedQuestions >= progress.dailyChallenge.targetQuestions) {
            progress.dailyChallenge.isCompleted = true;
          }
        }

        progress.lastActiveDate = new Date();
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      isCorrect,
      correctOption: question.correctOption,
      explanation: question.explanation,
      formula: question.formula,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Mock Tests list
// @route   GET /api/prep/mock-tests
// @access  Public
exports.getMockTests = async (req, res) => {
  try {
    const { category, difficulty, companyTag } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'all') query.category = category;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    if (companyTag && companyTag !== 'all') query.companyTag = new RegExp(companyTag, 'i');

    const tests = await MockTest.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tests,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single Mock Test details and question palette
// @route   GET /api/prep/mock-tests/:idOrSlug
// @access  Public
exports.getMockTestById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let test;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      test = await MockTest.findById(idOrSlug).populate({
        path: 'questions',
        select: 'title question options category topic difficulty', // Hide correctOption and explanation
      });
    } else {
      test = await MockTest.findOne({ slug: idOrSlug }).populate({
        path: 'questions',
        select: 'title question options category topic difficulty',
      });
    }

    if (!test) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    res.status(200).json({
      success: true,
      test,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit Mock Test and get detailed score report
// @route   POST /api/prep/mock-tests/:id/submit
// @access  Private / Public
exports.submitMockTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers = [], timeTakenSeconds = 0 } = req.body;

    const test = await MockTest.findById(id).populate('questions');
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let attemptedCount = 0;

    const evaluatedAnswers = test.questions.map((q) => {
      const userAns = answers.find((a) => a.questionId.toString() === q._id.toString());
      const selectedOption = userAns?.selectedOption || '';
      const isMarkedForReview = userAns?.isMarkedForReview || false;

      let isCorrect = false;
      if (selectedOption) {
        attemptedCount++;
        if (selectedOption.toUpperCase() === q.correctOption.toUpperCase()) {
          isCorrect = true;
          correctCount++;
        } else {
          wrongCount++;
        }
      }

      return {
        questionId: q._id,
        question: q.question,
        options: q.options,
        correctOption: q.correctOption,
        selectedOption,
        explanation: q.explanation,
        formula: q.formula,
        isCorrect,
        isMarkedForReview,
      };
    });

    const marksPerQuestion = test.totalMarks / (test.questions.length || 1);
    const negativeMark = test.negativeMarking || 0;
    const rawScore = (correctCount * marksPerQuestion) - (wrongCount * negativeMark * marksPerQuestion);
    const finalScore = Math.max(0, Math.round(rawScore * 10) / 10);
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    // Save attempt if logged in
    let savedAttempt = null;
    if (req.user?._id) {
      savedAttempt = await TestAttempt.create({
        user: req.user._id,
        mockTest: test._id,
        score: finalScore,
        accuracy,
        totalQuestions: test.questions.length,
        attemptedCount,
        correctCount,
        wrongCount,
        unansweredCount: test.questions.length - attemptedCount,
        timeTakenSeconds,
        answers: evaluatedAnswers.map(a => ({
          questionId: a.questionId,
          selectedOption: a.selectedOption,
          isCorrect: a.isCorrect,
          isMarkedForReview: a.isMarkedForReview,
        })),
      });

      await MockTest.findByIdAndUpdate(test._id, { $inc: { attemptsCount: 1 } });

      // Update user's PrepProgress with mock test performance
      const progress = await getOrCreateProgress(req.user._id);
      if (progress) {
        progress.completedQuestionsCount += attemptedCount;
        progress.correctQuestionsCount += correctCount;
        progress.lastActiveDate = new Date();
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      result: {
        score: finalScore,
        totalMarks: test.totalMarks,
        accuracy,
        totalQuestions: test.questions.length,
        attemptedCount,
        correctCount,
        wrongCount,
        unansweredCount: test.questions.length - attemptedCount,
        timeTakenSeconds,
        questionsReview: evaluatedAnswers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get user practice attempt history
// @route   GET /api/prep/practice-history
// @access  Private
exports.getPracticeHistory = async (req, res) => {
  try {
    const attempts = await PracticeAttempt.find({ user: req.user._id })
      .populate('question', 'title category topic difficulty')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      attempts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get user test history
// @route   GET /api/prep/mock-tests/history
// @access  Private
exports.getTestHistory = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .populate('mockTest', 'title category totalMarks durationMinutes')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      attempts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Coding Problems
// @route   GET /api/prep/coding/problems
// @access  Public
exports.getCodingProblems = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const query = {};

    if (category && category !== 'all') query.category = category;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    if (search && search.trim()) {
      query.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { category: new RegExp(search.trim(), 'i') },
      ];
    }

    const problems = await CodingProblem.find(query)
      .select('-hiddenTestCases')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      problems,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Single Coding Problem with Testcases
// @route   GET /api/prep/coding/problems/:idOrSlug
// @access  Public
exports.getCodingProblemById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let problem;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await CodingProblem.findById(idOrSlug).select('-hiddenTestCases');
    } else {
      problem = await CodingProblem.findOne({ slug: idOrSlug }).select('-hiddenTestCases');
    }

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Coding problem not found' });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Run Code (Sample Test Cases)
// @route   POST /api/prep/coding/:id/run
// @access  Public
exports.runCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { language, code } = req.body;

    const problem = await CodingProblem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const result = await runCodeSecurely(language, code, problem.sampleTestCases);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit Code (Evaluates Sample + Hidden Test Cases)
// @route   POST /api/prep/coding/:id/submit
// @access  Private / Public
exports.submitCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { language, code } = req.body;

    const problem = await CodingProblem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const allTestCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];
    const result = await runCodeSecurely(language, code, allTestCases);

    if (req.user?._id) {
      await CodingSubmission.create({
        user: req.user._id,
        problem: problem._id,
        language,
        code,
        status: result.status,
        passedTestCases: result.passedTestCases,
        totalTestCases: result.totalTestCases,
        executionTimeMs: result.executionTimeMs,
        testOutputs: result.testOutputs,
      });

      await CodingProblem.findByIdAndUpdate(problem._id, {
        $inc: {
          submissionsCount: 1,
          acceptedCount: result.status === 'Accepted' ? 1 : 0,
        },
      });

      // Update student progress
      const progress = await getOrCreateProgress(req.user._id);
      if (progress && progress.categoryStats) {
        progress.categoryStats.coding.attempted += 1;
        if (result.status === 'Accepted') {
          progress.categoryStats.coding.solved += 1;
        }
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Company Preparation Tracks
// @route   GET /api/prep/companies
// @access  Public
exports.getCompanyTracks = async (req, res) => {
  try {
    const tracks = await CompanyTrack.find({}).sort({ companyName: 1 });
    res.status(200).json({
      success: true,
      tracks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Company Preparation Track by Slug
// @route   GET /api/prep/companies/:slug
// @access  Public
exports.getCompanyTrackBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const track = await CompanyTrack.findOne({ slug: slug.toLowerCase() });
    if (!track) {
      return res.status(404).json({ success: false, message: 'Company track not found' });
    }
    res.status(200).json({
      success: true,
      track,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get Curated Interview Preparation Material
// @route   GET /api/prep/interview-prep
// @access  Public
exports.getInterviewPrep = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        starMethod: {
          title: 'The STAR Behavioral Interview Method',
          description: 'The premier framework recommended by Google, Amazon, and Fortune 500 recruiters to structure compelling behavioral answers.',
          steps: [
            { letter: 'S', name: 'Situation', desc: 'Set the context. Describe the specific challenge, project, or event you faced.' },
            { letter: 'T', name: 'Task', desc: 'Clarify what your responsibility was and what the desired outcome required.' },
            { letter: 'A', name: 'Action', desc: 'Explain the exact steps you took, tools utilized, and how you collaborated with peers.' },
            { letter: 'R', name: 'Result', desc: 'Quantify the outcome (e.g., latency cut by 35%, project delivered 2 weeks early).' },
          ],
        },
        resumeGuide: {
          title: 'Resume Crafting & ATS Checklist',
          tips: [
            'Format using clean single-column layout for 99%+ ATS machine parsing readability.',
            'Lead bullet points with powerful action verbs: Architected, Orchestrated, Optimized, Deployed.',
            'Incorporate XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].',
            'Tailor your core skills keyword section directly to the technical job requirements.',
          ],
        },
        projectGuide: {
          title: 'How to Pitch & Explain Capstone Projects',
          structure: [
            'Problem Statement & User Need (30 seconds)',
            'Architecture & Tech Stack Choice Justification (45 seconds)',
            'Toughest Technical Challenge & How You Overcame It (60 seconds)',
            'Measurable Results & Future Scalability Enhancements (30 seconds)',
          ],
        },
        hrQuestions: [
          {
            q: 'Tell me about yourself.',
            tips: 'Focus on your educational journey, passion for tech, notable projects, and why this company excites you.',
            sampleAnswer: 'I am a computer science graduate passionate about building scalable full-stack applications. Over the past few years, I’ve mastered React, Node.js, and cloud deployments, developing several production applications including a distributed job portal. I’m eager to bring my engineering discipline to your innovative team.'
          },
          {
            q: 'What is your greatest technical strength and greatest area for improvement?',
            tips: 'Highlight a genuine technical superpower and a real area you are actively learning.',
            sampleAnswer: 'My greatest strength is rapid problem decomposition—breaking complex system specs into modular components. My area for improvement has been DevOps infrastructure, which is why I recently earned my Docker and Kubernetes certification.'
          },
          {
            q: 'Why do you want to join our organization?',
            tips: 'Reference their recent engineering blog posts, market products, and engineering culture.',
            sampleAnswer: 'Your commitment to developer experience and reliable distributed architecture aligns closely with my engineering values. I want to contribute to systems that impact millions of users globally.'
          },
          {
            q: 'Describe a time you had a conflict with a team member.',
            tips: 'Use the STAR method. Emphasize empathy, code reviews, and prioritizing product quality.',
            sampleAnswer: 'During our final year project, my peer and I disagreed on whether to use GraphQL or REST. Instead of arguing, we created a benchmark matrix comparing payload sizes and dev velocity, mutually agreeing on GraphQL for our mobile endpoints.'
          }
        ],
        technicalDomains: [
          {
            domain: 'Full-Stack & Web Systems',
            questions: [
              { q: 'How does the Virtual DOM work in React, and how does reconciliation work with Keys?', a: 'React creates an in-memory Virtual DOM tree. When state changes, a diffing algorithm (O(n)) compares the new tree with the previous one. Keys allow React to match children across renders without re-mounting identical elements.' },
              { q: 'Explain Event Loop in Node.js (Microtasks vs Macrotasks).', a: 'The Node.js event loop runs in phases: Timers, I/O callbacks, Idle/prepare, Poll, Check (setImmediate), and Close. process.nextTick and Promise microtasks run immediately between each phase before moving to macrotasks.' },
              { q: 'What is the difference between SQL and NoSQL database scaling (Vertical vs Horizontal)?', a: 'SQL databases (ACID) scale vertically (bigger CPU/RAM) or via read replicas. NoSQL databases (BASE, MongoDB, Cassandra) scale horizontally by sharding documents across distributed partitions.' }
            ]
          },
          {
            domain: 'Data Structures & Algorithms',
            questions: [
              { q: 'When would you use BFS versus DFS on a graph?', a: 'Use BFS when finding the shortest path in unweighted graphs or level-order traversal. Use DFS for topological sorting, cycle detection, pathfinding in maze/puzzle backtracking, and memory efficiency on deep trees.' },
              { q: 'What is the time and space complexity of QuickSort vs MergeSort?', a: 'QuickSort is O(N log N) average, O(N^2) worst case, with O(log N) in-place space. MergeSort is guaranteed O(N log N) in all cases, but requires O(N) auxiliary memory.' }
            ]
          }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
