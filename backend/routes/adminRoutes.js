const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobsAdmin,
  moderateJob,
  deleteJobAdmin,
  verifyCompany,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/jobs', getAllJobsAdmin);
router.put('/jobs/:id/moderate', moderateJob);
router.delete('/jobs/:id', deleteJobAdmin);

router.put('/companies/:id/verify', verifyCompany);

module.exports = router;
