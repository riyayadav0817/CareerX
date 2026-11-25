const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Company = require('../models/Company');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'careerx_super_secret_jwt_key_2026_modern_job_portal',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register user (job seeker or recruiter)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, companyName, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email and password',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const assignedRole = role === 'recruiter' ? 'recruiter' : 'jobseeker';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      location: location || '',
    });

    // If registered as recruiter and companyName was provided, create the initial company profile
    if (assignedRole === 'recruiter') {
      const cName = companyName && companyName.trim() ? companyName.trim() : `${name}'s Organization`;
      const company = await Company.create({
        name: cName,
        slug: cName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        location: location || 'Global',
        recruiter: user._id,
      });

      user.company = company._id;
      await user.save();
    }

    const token = generateToken(user._id);

    // Fetch fresh user with company
    const populatedUser = await User.findById(user._id).populate('company');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        avatar: populatedUser.avatar,
        headline: populatedUser.headline,
        company: populatedUser.company,
        skills: populatedUser.skills,
        resume: populatedUser.resume,
      },
      message: 'Account registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('company');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        resume: user.resume,
        education: user.education,
        experience: user.experience,
        portfolioLinks: user.portfolioLinks,
        company: user.company,
      },
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('company');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      headline,
      bio,
      location,
      phone,
      skills,
      education,
      experience,
      portfolioLinks,
      avatar,
    } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (headline !== undefined) fieldsToUpdate.headline = headline;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (location !== undefined) fieldsToUpdate.location = location;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (skills !== undefined) fieldsToUpdate.skills = skills;
    if (education !== undefined) fieldsToUpdate.education = education;
    if (experience !== undefined) fieldsToUpdate.experience = experience;
    if (portfolioLinks !== undefined) fieldsToUpdate.portfolioLinks = portfolioLinks;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).populate('company');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
};

// @desc    Upload resume
// @route   POST /api/auth/upload-resume
// @access  Private (Job seeker)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume file (PDF, DOC, DOCX)',
      });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          resume: {
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: updatedUser.resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resume',
    });
  }
};

// @desc    Upload avatar
// @route   POST /api/auth/upload-avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file',
      });
    }

    const fileUrl = `/uploads/logos/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: fileUrl } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: fileUrl,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload avatar',
    });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset instructions generated',
      resetToken, // Returned in dev mode for convenient testing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process forgot password request',
    });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset password',
    });
  }
};
