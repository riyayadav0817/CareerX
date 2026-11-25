const mongoose = require('mongoose');

const companyTrackSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: '',
    },
    overview: {
      type: String,
      required: true,
    },
    selectionProcess: [
      {
        roundNumber: { type: Number, required: true },
        title: { type: String, required: true },
        duration: { type: String, default: '' },
        description: { type: String, required: true },
      },
    ],
    examPattern: [
      {
        section: { type: String, required: true },
        questionCount: { type: Number, required: true },
        durationMinutes: { type: Number, required: true },
        marks: { type: Number, required: true },
        negativeMarking: { type: String, default: 'None' },
      },
    ],
    syllabus: [
      {
        category: { type: String, required: true },
        topics: { type: [String], default: [] },
      },
    ],
    technicalInterviewQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        topic: { type: String, default: 'General' },
        difficulty: { type: String, default: 'Medium' },
      },
    ],
    hrInterviewQuestions: [
      {
        question: { type: String, required: true },
        sampleAnswer: { type: String, required: true },
        tips: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanyTrack', companyTrackSchema);
