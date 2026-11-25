const Application = require('../models/Application');
const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker)
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.status !== 'active' || job.moderationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer accepting applications',
      });
    }

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job position',
      });
    }

    // Determine resume: either uploaded with request or profile resume
    let resumeData = { ...req.user.resume };
    if (req.file) {
      resumeData = {
        url: `/uploads/resumes/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        updatedAt: new Date(),
      };
      // Also update user's default resume if they didn't have one
      if (!req.user.resume || !req.user.resume.url) {
        await User.findByIdAndUpdate(req.user._id, { resume: resumeData });
      }
    }

    if (!resumeData || !resumeData.url) {
      return res.status(400).json({
        success: false,
        message: 'Please upload or provide a resume before applying',
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      company: job.company._id,
      resume: resumeData,
      coverLetter: coverLetter || '',
      status: 'Applied',
    });

    // Increment applicant count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    // Notify the recruiter
    await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${job.title}"`,
      type: 'job_alert',
      link: `/recruiter/applicants?jobId=${job._id}`,
    });

    // Notify seeker
    await Notification.create({
      recipient: req.user._id,
      title: 'Application Submitted',
      message: `Your application for "${job.title}" at ${job.company.name} was successfully submitted!`,
      type: 'application_status',
      link: '/seeker/applications',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    console.error('applyJob error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application',
    });
  }
};

// @desc    Get seeker's applied jobs
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker)
exports.getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { applicant: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'job',
        select: 'title category location workMode jobType salary status deadline skills',
      })
      .populate({
        path: 'company',
        select: 'name logo location website',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching applications',
    });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id/withdraw
// @access  Private (Job Seeker)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicant: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (['Hired', 'Interview Scheduled'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw application once stage is "${application.status}"`,
      });
    }

    const jobId = application.job;
    await Application.findByIdAndDelete(req.params.id);
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error withdrawing application',
    });
  }
};

// @desc    Get applicants for recruiter
// @route   GET /api/applications/recruiter/applicants
// @access  Private (Recruiter)
exports.getRecruiterApplicants = async (req, res) => {
  try {
    const { jobId, status, search } = req.query;
    let jobQuery = { recruiter: req.user._id };

    if (jobId) {
      jobQuery._id = jobId;
    }

    const recruiterJobs = await Job.find(jobQuery).select('_id');
    const jobIds = recruiterJobs.map((j) => j._id);

    const appQuery = { job: { $in: jobIds } };
    if (status && status !== 'All') {
      appQuery.status = status;
    }

    let applications = await Application.find(appQuery)
      .populate('job', 'title category location workMode jobType')
      .populate({
        path: 'applicant',
        select: 'name email phone avatar headline location skills resume education experience portfolioLinks',
      })
      .sort({ createdAt: -1 });

    // Optional text filter on candidate name, skills, or headline
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      applications = applications.filter((app) => {
        const u = app.applicant;
        if (!u) return false;
        return (
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.headline && u.headline.toLowerCase().includes(q)) ||
          (u.skills && u.skills.some((s) => s.toLowerCase().includes(q)))
        );
      });
    }

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching applicants',
    });
  }
};

// @desc    Update applicant status & schedule interview
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, recruiterNotes, interviewDetails } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Verify recruiter owns the job
    if (application.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this application',
      });
    }

    if (status) {
      application.status = status;
    }

    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }

    if (interviewDetails) {
      application.interviewDetails = {
        scheduledAt: interviewDetails.scheduledAt || application.interviewDetails.scheduledAt,
        meetingLink: interviewDetails.meetingLink || application.interviewDetails.meetingLink,
        notes: interviewDetails.notes || application.interviewDetails.notes,
        round: interviewDetails.round || application.interviewDetails.round || 'Technical Interview',
      };
      if (status === 'Interview Scheduled' || !status) {
        application.status = 'Interview Scheduled';
      }
    }

    await application.save();

    // Notify seeker
    let notifTitle = `Application Status Update: ${application.status}`;
    let notifMsg = `Your application for "${application.job.title}" at ${application.company.name} is now: ${application.status}.`;

    if (application.status === 'Interview Scheduled') {
      notifTitle = 'Interview Scheduled! 🎉';
      notifMsg = `Interview scheduled for "${application.job.title}". Round: ${application.interviewDetails.round}. Check dashboard for details!`;
    }

    await Notification.create({
      recipient: application.applicant,
      sender: req.user._id,
      title: notifTitle,
      message: notifMsg,
      type: application.status === 'Interview Scheduled' ? 'interview' : 'application_status',
      link: '/seeker/applications',
    });

    res.status(200).json({
      success: true,
      message: `Candidate application status updated to ${application.status}`,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating status',
    });
  }
};

// @desc    Save/Bookmark a job
// @route   POST /api/applications/saved-jobs/:jobId
// @access  Private (Job Seeker)
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Job is already bookmarked in your saved list',
      });
    }

    const saved = await SavedJob.create({
      user: req.user._id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: 'Job bookmarked successfully',
      saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unsave/remove bookmark
// @route   DELETE /api/applications/saved-jobs/:jobId
// @access  Private (Job Seeker)
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    await SavedJob.findOneAndDelete({ user: req.user._id, job: jobId });

    res.status(200).json({
      success: true,
      message: 'Job removed from saved list',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get seeker's saved jobs
// @route   GET /api/applications/saved-jobs
// @access  Private (Job Seeker)
exports.getSavedJobs = async (req, res) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location website' },
      })
      .sort({ createdAt: -1 });

    const jobs = saved.map((s) => s.job).filter(Boolean);

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

// @desc    Get recommended jobs based on seeker's skills
// @route   GET /api/applications/recommended-jobs
// @access  Private (Job Seeker)
exports.getRecommendedJobs = async (req, res) => {
  try {
    const seekerSkills = req.user.skills || [];

    let query = {
      status: 'active',
      moderationStatus: 'approved',
    };

    if (seekerSkills.length > 0) {
      query.skills = { $in: seekerSkills.map((s) => new RegExp(`^${s.trim()}$`, 'i')) };
    }

    let recommended = await Job.find(query)
      .populate('company', 'name logo location website')
      .limit(8);

    if (recommended.length === 0) {
      // Fallback to top featured jobs
      recommended = await Job.find({ status: 'active', moderationStatus: 'approved' })
        .populate('company', 'name logo location website')
        .sort({ applicantCount: -1 })
        .limit(8);
    }

    res.status(200).json({
      success: true,
      jobs: recommended,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
