const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getQuestions,
  getTopicsByCategory,
  submitPracticeAnswer,
  getPracticeHistory,
  getMockTests,
  getMockTestById,
  submitMockTest,
  getTestHistory,
  getCodingProblems,
  getCodingProblemById,
  runCode,
  submitCode,
  getCompanyTracks,
  getCompanyTrackBySlug,
  getInterviewPrep,
} = require('../controllers/prepController');
const { protect, optionalAuth } = require('../middleware/auth');

// Dashboard & Stats
router.get('/dashboard', optionalAuth, getDashboardStats);

// Practice Questions & Topics
router.get('/questions', getQuestions);
router.get('/topics/:category', getTopicsByCategory);
router.post('/practice-attempt', optionalAuth, submitPracticeAnswer);
router.get('/practice-history', protect, getPracticeHistory);

// Mock Tests
router.get('/mock-tests', getMockTests);
router.get('/mock-tests/history', protect, getTestHistory);
router.get('/mock-tests/:idOrSlug', getMockTestById);
router.post('/mock-tests/:id/submit', optionalAuth, submitMockTest);

// Coding & DSA
router.get('/coding/problems', getCodingProblems);
router.get('/coding/problems/:idOrSlug', getCodingProblemById);
router.post('/coding/run', (req, res, next) => {
  req.params.id = req.body.problemId || req.query.id;
  runCode(req, res, next);
});
router.post('/coding/submit', optionalAuth, (req, res, next) => {
  req.params.id = req.body.problemId || req.query.id;
  submitCode(req, res, next);
});
router.post('/coding/:id/run', runCode);
router.post('/coding/:id/submit', optionalAuth, submitCode);

// Company Specific Preparation Tracks
router.get('/companies', getCompanyTracks);
router.get('/companies/:slug', getCompanyTrackBySlug);

// Interview Preparation Resources
router.get('/interview-prep', getInterviewPrep);

module.exports = router;
