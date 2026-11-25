const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get all jobs with advanced filtering, sorting, pagination
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      jobType,
      workMode,
      experienceLevel,
      minSalary,
      maxSalary,
      datePosted,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: 'active',
      moderationStatus: 'approved',
    };

    // Keyword Search across title, description, skills
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { skills: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    // Location filter
    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Job Type filter (Full-time, Part-time, Internship, Contract)
    if (jobType && jobType !== 'All') {
      const types = Array.isArray(jobType) ? jobType : jobType.split(',');
      query.jobType = { $in: types };
    }

    // Work Mode filter (Remote, Hybrid, On-site)
    if (workMode && workMode !== 'All') {
      const modes = Array.isArray(workMode) ? workMode : workMode.split(',');
      query.workMode = { $in: modes };
    }

    // Experience Level filter
    if (experienceLevel && experienceLevel !== 'All') {
      const levels = Array.isArray(experienceLevel) ? experienceLevel : experienceLevel.split(',');
      query.experienceLevel = { $in: levels };
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      query['salary.max'] = {};
      if (minSalary) {
        query['salary.max'].$gte = Number(minSalary);
      }
      if (maxSalary) {
        query['salary.min'] = { $lte: Number(maxSalary) };
      }
    }

    // Date Posted filter
    if (datePosted) {
      const now = new Date();
      let pastDate = new Date();
      if (datePosted === '24h') {
        pastDate.setDate(now.getDate() - 1);
        query.createdAt = { $gte: pastDate };
      } else if (datePosted === '7d') {
        pastDate.setDate(now.getDate() - 7);
        query.createdAt = { $gte: pastDate };
      } else if (datePosted === '14d') {
        pastDate.setDate(now.getDate() - 14);
        query.createdAt = { $gte: pastDate };
      } else if (datePosted === '30d') {
        pastDate.setDate(now.getDate() - 30);
        query.createdAt = { $gte: pastDate };
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'salary_high') {
      sortOption = { 'salary.max': -1 };
    } else if (sort === 'salary_low') {
      sortOption = { 'salary.min': 1 };
    } else if (sort === 'views') {
      sortOption = { viewsCount: -1 };
    } else if (sort === 'most_applied') {
      sortOption = { applicantCount: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location website industry verified')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching jobs',
    });
  }
};

// @desc    Get featured jobs
// @route   GET /api/jobs/featured
// @access  Public
exports.getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: 'active',
      moderationStatus: 'approved',
      featured: true,
    })
      .populate('company', 'name logo location website industry verified')
      .sort({ createdAt: -1 })
      .limit(6);

    // Fallback if not enough featured jobs marked
    let finalJobs = jobs;
    if (jobs.length < 6) {
      finalJobs = await Job.find({
        status: 'active',
        moderationStatus: 'approved',
      })
        .populate('company', 'name logo location website industry verified')
        .sort({ applicantCount: -1, createdAt: -1 })
        .limit(6);
    }

    res.status(200).json({
      success: true,
      jobs: finalJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single job by ID & fetch similar jobs
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('recruiter', 'name email phone avatar');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Increment views count asynchronously
    await Job.findByIdAndUpdate(job._id, { $inc: { viewsCount: 1 } });

    // Fetch similar jobs (same category or overlapping skills)
    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      category: job.category,
      status: 'active',
      moderationStatus: 'approved',
    })
      .populate('company', 'name logo location website')
      .limit(4);

    res.status(200).json({
      success: true,
      job,
      similarJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching job details',
    });
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter)
exports.createJob = async (req, res) => {
  try {
    if (!req.user.company) {
      return res.status(400).json({
        success: false,
        message: 'You must have an associated company profile to post a job',
      });
    }

    const {
      title,
      category,
      location,
      workMode,
      jobType,
      experienceLevel,
      salary,
      description,
      responsibilities,
      qualifications,
      skills,
      benefits,
      deadline,
      featured,
    } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, location, and description',
      });
    }

    const job = await Job.create({
      title,
      company: req.user.company._id || req.user.company,
      recruiter: req.user._id,
      category,
      location,
      workMode: workMode || 'Remote',
      jobType: jobType || 'Full-time',
      experienceLevel: experienceLevel || 'Mid Level',
      salary: salary || { min: 60000, max: 120000, currency: 'USD', period: 'year' },
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      qualifications: Array.isArray(qualifications) ? qualifications : (qualifications ? qualifications.split('\n').filter(Boolean) : []),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n').filter(Boolean) : []),
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      featured: featured || false,
      status: 'active',
      moderationStatus: 'approved',
    });

    const populatedJob = await Job.findById(job._id).populate('company');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job: populatedJob,
    });
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating job',
    });
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Verify ownership (or admin)
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job posting',
      });
    }

    const {
      title,
      category,
      location,
      workMode,
      jobType,
      experienceLevel,
      salary,
      description,
      responsibilities,
      qualifications,
      skills,
      benefits,
      status,
      deadline,
      featured,
    } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (category) updateFields.category = category;
    if (location) updateFields.location = location;
    if (workMode) updateFields.workMode = workMode;
    if (jobType) updateFields.jobType = jobType;
    if (experienceLevel) updateFields.experienceLevel = experienceLevel;
    if (salary) updateFields.salary = salary;
    if (description) updateFields.description = description;
    if (responsibilities) {
      updateFields.responsibilities = Array.isArray(responsibilities) ? responsibilities : responsibilities.split('\n').filter(Boolean);
    }
    if (qualifications) {
      updateFields.qualifications = Array.isArray(qualifications) ? qualifications : qualifications.split('\n').filter(Boolean);
    }
    if (skills) {
      updateFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (benefits) {
      updateFields.benefits = Array.isArray(benefits) ? benefits : benefits.split('\n').filter(Boolean);
    }
    if (status) updateFields.status = status;
    if (deadline) updateFields.deadline = deadline;
    if (featured !== undefined) updateFields.featured = featured;

    job = await Job.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true }).populate('company');

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating job',
    });
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting',
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also remove applications for this job
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job posting and related applications deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting job',
    });
  }
};

// @desc    Get recruiter posted jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    // Attach latest live application counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        const interviewCount = await Application.countDocuments({ job: job._id, status: 'Interview Scheduled' });
        const jobObj = job.toObject();
        jobObj.applicantCount = count;
        jobObj.interviewCount = interviewCount;
        return jobObj;
      })
    );

    res.status(200).json({
      success: true,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching recruiter jobs',
    });
  }
};

// @desc    Get job categories with count
// @route   GET /api/jobs/meta/categories
// @access  Public
exports.getJobCategories = async (req, res) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: 'active', moderationStatus: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      categories: categories.map(c => ({ name: c._id, count: c.count })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get platform stats (Jobs, Companies, Candidates, Placements)
// @route   GET /api/jobs/meta/stats
// @access  Public
exports.getPlatformStats = async (req, res) => {
  try {
    const [totalJobs, totalCompanies, totalCandidates, totalPlacements] = await Promise.all([
      Job.countDocuments({ status: 'active' }),
      Company.countDocuments({}),
      User.countDocuments({ role: 'jobseeker' }),
      Application.countDocuments({ status: 'Hired' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs: totalJobs || 120,
        totalCompanies: totalCompanies || 48,
        totalCandidates: totalCandidates || 1540,
        totalPlacements: totalPlacements || 320,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
