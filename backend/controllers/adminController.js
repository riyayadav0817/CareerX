const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get Admin Overview KPIs & Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalRecruiters,
      totalJobSeekers,
      totalJobs,
      activeJobs,
      pendingJobs,
      totalApplications,
      totalCompanies,
      hiredCount,
      interviewCount,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'recruiter' }),
      User.countDocuments({ role: 'jobseeker' }),
      Job.countDocuments({}),
      Job.countDocuments({ status: 'active', moderationStatus: 'approved' }),
      Job.countDocuments({ moderationStatus: 'pending' }),
      Application.countDocuments({}),
      Company.countDocuments({}),
      Application.countDocuments({ status: 'Hired' }),
      Application.countDocuments({ status: 'Interview Scheduled' }),
    ]);

    // Application statuses breakdown
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Jobs by category
    const jobsByCategory = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Recent registered users
    const recentUsers = await User.find({})
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent applications
    const recentApplications = await Application.find({})
      .populate('applicant', 'name email avatar')
      .populate('job', 'title')
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRecruiters,
        totalJobSeekers,
        totalJobs,
        activeJobs,
        pendingJobs,
        totalApplications,
        totalCompanies,
        hiredCount,
        interviewCount,
      },
      statusBreakdown: statusCounts,
      jobsByCategory,
      recentUsers,
      recentApplications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin metrics',
    });
  }
};

// @desc    Get all users with search, role filter and pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { email: new RegExp(search.trim(), 'i') },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user status (suspend / activate) or role
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status, role } = req.body;
    const update = {};
    if (status) update.status = status;
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User updated successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Cleanup applications
    await Application.deleteMany({ applicant: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User removed from platform',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all jobs for moderation
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobsAdmin = async (req, res) => {
  try {
    const { moderationStatus, search } = req.query;
    const query = {};

    if (moderationStatus && moderationStatus !== 'All') {
      query.moderationStatus = moderationStatus;
    }

    if (search && search.trim()) {
      query.title = new RegExp(search.trim(), 'i');
    }

    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Moderate job (approve / reject)
// @route   PUT /api/admin/jobs/:id/moderate
// @access  Private (Admin)
exports.moderateJob = async (req, res) => {
  try {
    const { moderationStatus } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(moderationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid moderation status' });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: { moderationStatus } },
      { new: true }
    ).populate('company');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      message: `Job moderation status set to ${moderationStatus}`,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete inappropriate job posting
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
exports.deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job posting deleted by admin',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify or unverify company
// @route   PUT /api/admin/companies/:id/verify
// @access  Private (Admin)
exports.verifyCompany = async (req, res) => {
  try {
    const { verified } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { verified: Boolean(verified) } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      message: `Company verification updated`,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
