const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      index: true,
    },
    category: {
      type: String,
      required: true, // e.g. 'Arrays & Strings', 'Dynamic Programming', 'Trees & BST'
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    inputFormat: {
      type: String,
      default: '',
    },
    outputFormat: {
      type: String,
      default: '',
    },
    constraints: {
      type: [String],
      default: [],
    },
    sampleTestCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, default: '' },
      },
    ],
    hiddenTestCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
    starterTemplates: {
      python: { type: String, default: '' },
      javascript: { type: String, default: '' },
      java: { type: String, default: '' },
      cpp: { type: String, default: '' },
    },
    hints: {
      type: [String],
      default: [],
    },
    solutionExplanation: {
      type: String,
      default: '',
    },
    companyTags: {
      type: [String],
      default: [],
      index: true,
    },
    submissionsCount: {
      type: Number,
      default: 0,
    },
    acceptedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
