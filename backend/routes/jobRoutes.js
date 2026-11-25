const express = require('express');
const router = express.Router();
const {
  getJobs,
  getFeaturedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getJobCategories,
  getPlatformStats,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/meta/categories', getJobCategories);
router.get('/meta/stats', getPlatformStats);

// Recruiter specific routes
router.get('/recruiter/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

// Public single job route (placed after specific sub-routes)
router.get('/:id', getJobById);

module.exports = router;
