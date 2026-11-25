import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen,
  HelpCircle,
  FileText,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Check,
  RotateCcw,
  Building2
} from 'lucide-react';

export default function PracticeTopicPage({ category = 'aptitude', defaultTitle = 'Quantitative Aptitude' }) {
  const location = useLocation();

  // Determine category from path if not passed as prop
  let currentCategory = category;
  if (location.pathname.includes('/reasoning')) currentCategory = 'reasoning';
  else if (location.pathname.includes('/verbal')) currentCategory = 'verbal';
  else if (location.pathname.includes('/core-cs')) currentCategory = 'core-cs';
  else if (location.pathname.includes('/aptitude')) currentCategory = 'aptitude';

  const categoryMeta = {
    aptitude: {
      title: 'Quantitative Aptitude',
      desc: 'Master 12 quantitative topics: Number Systems, Percentages, Time & Work, Speed, Probability...',
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      topics: [
        'All',
        'Number System',
        'Percentages',
        'Profit and Loss',
        'Simple and Compound Interest',
        'Ratio and Proportion',
        'Time and Work',
        'Time, Speed and Distance',
        'Probability',
        'Permutation and Combination',
        'Averages',
        'Mixtures and Allegations',
        'Data Interpretation',
      ],
    },
    reasoning: {
      title: 'Logical Reasoning',
      desc: 'Master 10 analytical topics: Coding & Decoding, Blood Relations, Puzzles, Syllogisms...',
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      topics: [
        'All',
        'Coding and Decoding',
        'Blood Relations',
        'Direction Sense',
        'Seating Arrangements',
        'Puzzles',
        'Syllogisms',
        'Number and Alphabet Series',
        'Analogies',
        'Data Sufficiency',
        'Logical Deductions',
      ],
    },
    verbal: {
      title: 'Verbal Ability',
      desc: 'Master 8 verbal topics: Reading Comprehension, Grammar, Sentence Correction, Para Jumbles...',
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      topics: [
        'All',
        'Grammar',
        'Vocabulary',
        'Synonyms and Antonyms',
        'Reading Comprehension',
        'Sentence Correction',
        'Para Jumbles',
        'Fill in the Blanks',
        'Error Detection',
      ],
    },
    'core-cs': {
      title: 'Core Computer Science',
      desc: 'Master 6 core disciplines: DBMS & SQL, Operating Systems, Computer Networks, OOP, Software Eng...',
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      topics: [
        'All',
        'DBMS and SQL',
        'Operating Systems',
        'Computer Networks',
        'Object-Oriented Programming',
        'Software Engineering',
        'Computer Architecture',
      ],
    },
  };

  const meta = categoryMeta[currentCategory] || categoryMeta.aptitude;

  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Question interaction state
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: { selectedOption, isCorrect, explanation, formula } }
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('category', currentCategory);
        if (selectedTopic !== 'All') queryParams.append('topic', selectedTopic);
        if (selectedDifficulty !== 'all') queryParams.append('difficulty', selectedDifficulty);
        if (search.trim()) queryParams.append('search', search.trim());
        queryParams.append('limit', 50);

        const res = await api.get(`/prep/questions?${queryParams.toString()}`);
        if (res.data.success) {
          setQuestions(res.data.questions || []);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentCategory, selectedTopic, selectedDifficulty, search]);

  const handleSelectOption = async (questionId, optionId) => {
    if (userAnswers[questionId] || submittingAnswer) return; // Prevent double answer

    setSubmittingAnswer(true);
    try {
      const res = await api.post('/prep/practice-attempt', {
        questionId,
        selectedOption: optionId,
      });

      if (res.data.success) {
        setUserAnswers((prev) => ({
          ...prev,
          [questionId]: {
            selectedOption: optionId,
            isCorrect: res.data.isCorrect,
            correctOption: res.data.correctOption,
            explanation: res.data.explanation,
            formula: res.data.formula,
          },
        }));
      }
    } catch (err) {
      console.error('Error recording answer:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = currentQ ? userAnswers[currentQ._id] : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/placement-prep" className="hover:text-indigo-600">Placement Prep</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{meta.title}</span>
        </nav>

        {/* Category Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              {meta.icon}
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
                Interactive Practice Module
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {meta.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {meta.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/mock-tests"
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
            >
              Take Mock Test
            </Link>
          </div>
        </div>

        {/* Topic Filters Carousel / Pills */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Select Topic ({meta.topics.length - 1} available)</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full bg-transparent outline-none text-slate-800"
                />
              </div>

              {/* Difficulty */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {meta.topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedTopic === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Interactive Question Card or Loading/Empty */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-slate-500">Loading {meta.title} questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No questions found in this filter</h3>
            <p className="text-xs text-slate-500">Try selecting "All Topics" or clearing the search query.</p>
            <button
              onClick={() => {
                setSelectedTopic('All');
                setSelectedDifficulty('all');
                setSearch('');
              }}
              className="px-5 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Question Navigator Header */}
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/90">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>

            {/* Active Question Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              {/* Question metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
                    {currentQ.topic}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold ${
                      currentQ.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700'
                        : currentQ.difficulty === 'Hard'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {currentQ.difficulty}
                  </span>
                </div>

                {currentQ.companyTags && currentQ.companyTags.length > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Asked in: <strong>{currentQ.companyTags.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              {/* Title & Question Statement */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = currentAnswer?.selectedOption === opt.id;
                  const isCorrect = currentAnswer?.correctOption === opt.id;
                  const isWrong = isSelected && !currentAnswer?.isCorrect;

                  let optionStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-800';
                  if (currentAnswer) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold';
                    } else if (isWrong) {
                      optionStyle = 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold';
                    } else {
                      optionStyle = 'border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ._id, opt.id)}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                          {opt.id}
                        </span>
                        <span className="text-xs sm:text-sm">{opt.text}</span>
                      </div>

                      {currentAnswer && (
                        <div>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span>Correct</span>
                            </span>
                          )}
                          {isWrong && (
                            <span className="flex items-center gap-1 text-xs text-rose-700 font-bold">
                              <XCircle className="w-5 h-5 text-rose-600" />
                              <span>Incorrect</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation & Formula Box (Revealed after selection) */}
              {currentAnswer && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Detailed Solution & Explanation</h4>
                  </div>

                  {currentAnswer.formula && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs font-mono text-indigo-900">
                      <strong>Formula: </strong> {currentAnswer.formula}
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {currentAnswer.explanation}
                  </div>

                  <div className="flex justify-end pt-2">
                    {currentIndex < questions.length - 1 && (
                      <button
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
