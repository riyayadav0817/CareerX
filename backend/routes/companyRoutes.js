const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyDetails,
  updateMyCompany,
  uploadCompanyLogo,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getCompanies);
router.get('/:idOrSlug', getCompanyDetails);

// Recruiter routes
router.put('/my-company', protect, authorize('recruiter', 'admin'), updateMyCompany);
router.post('/upload-logo', protect, authorize('recruiter', 'admin'), upload.single('logo'), uploadCompanyLogo);

module.exports = router;
