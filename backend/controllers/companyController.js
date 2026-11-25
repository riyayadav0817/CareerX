const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies with search and filters
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const { search, industry, location } = req.query;
    const query = {};

    if (search && search.trim()) {
      query.name = new RegExp(search.trim(), 'i');
    }

    if (industry && industry !== 'All') {
      query.industry = new RegExp(`^${industry}$`, 'i');
    }

    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    const companies = await Company.find(query).sort({ verified: -1, createdAt: -1 });

    // Attach active jobs count for each company
    const companiesWithJobCount = await Promise.all(
      companies.map(async (comp) => {
        const openJobsCount = await Job.countDocuments({
          company: comp._id,
          status: 'active',
          moderationStatus: 'approved',
        });
        const obj = comp.toObject();
        obj.openJobsCount = openJobsCount;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      companies: companiesWithJobCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching companies',
    });
  }
};

// @desc    Get single company by ID or Slug with active jobs
// @route   GET /api/companies/:idOrSlug
// @access  Public
exports.getCompanyDetails = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let company;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      company = await Company.findById(idOrSlug);
    } else {
      company = await Company.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    const jobs = await Job.find({
      company: company._id,
      status: 'active',
      moderationStatus: 'approved',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      company,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching company details',
    });
  }
};

// @desc    Update current recruiter's company profile
// @route   PUT /api/companies/my-company
// @access  Private (Recruiter)
exports.updateMyCompany = async (req, res) => {
  try {
    if (!req.user.company) {
      return res.status(400).json({
        success: false,
        message: 'No company linked to your recruiter profile',
      });
    }

    const companyId = req.user.company._id || req.user.company;
    const {
      name,
      website,
      industry,
      companySize,
      location,
      description,
      about,
      foundedYear,
      socialLinks,
      logo,
    } = req.body;

    const fieldsToUpdate = {};
    if (name) {
      fieldsToUpdate.name = name;
      fieldsToUpdate.slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    if (website !== undefined) fieldsToUpdate.website = website;
    if (industry !== undefined) fieldsToUpdate.industry = industry;
    if (companySize !== undefined) fieldsToUpdate.companySize = companySize;
    if (location !== undefined) fieldsToUpdate.location = location;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (about !== undefined) fieldsToUpdate.about = about;
    if (foundedYear !== undefined) fieldsToUpdate.foundedYear = foundedYear;
    if (socialLinks !== undefined) fieldsToUpdate.socialLinks = socialLinks;
    if (logo !== undefined) fieldsToUpdate.logo = logo;

    const updated = await Company.findByIdAndUpdate(
      companyId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      company: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating company profile',
    });
  }
};

// @desc    Upload company logo
// @route   POST /api/companies/upload-logo
// @access  Private (Recruiter)
exports.uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file for company logo',
      });
    }

    if (!req.user.company) {
      return res.status(400).json({
        success: false,
        message: 'No company linked to current user',
      });
    }

    const companyId = req.user.company._id || req.user.company;
    const logoUrl = `/uploads/logos/${req.file.filename}`;

    const updated = await Company.findByIdAndUpdate(
      companyId,
      { $set: { logo: logoUrl } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Company logo uploaded successfully',
      logo: logoUrl,
      company: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading logo',
    });
  }
};
