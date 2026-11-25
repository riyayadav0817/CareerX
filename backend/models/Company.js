const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: 'Technology',
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '51-200',
    },
    location: {
      type: String,
      required: [true, 'Please provide company headquarters location'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    about: {
      type: String,
      default: '',
    },
    foundedYear: {
      type: Number,
      default: 2020,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
