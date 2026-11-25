const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  withdrawApplication,
  getRecruiterApplicants,
  updateApplicationStatus,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getRecommendedJobs,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Job seeker actions
router.post('/:jobId/apply', protect, authorize('jobseeker'), upload.single('resume'), applyJob);
router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);
router.delete('/:id/withdraw', protect, authorize('jobseeker'), withdrawApplication);
router.post('/saved-jobs/:jobId', protect, authorize('jobseeker'), saveJob);
router.delete('/saved-jobs/:jobId', protect, authorize('jobseeker'), unsaveJob);
router.get('/saved-jobs', protect, authorize('jobseeker'), getSavedJobs);
router.get('/recommended-jobs', protect, authorize('jobseeker'), getRecommendedJobs);

// Recruiter actions
router.get('/recruiter/applicants', protect, authorize('recruiter', 'admin'), getRecruiterApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
