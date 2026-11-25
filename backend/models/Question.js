const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['aptitude', 'reasoning', 'verbal', 'core-cs'],
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subtopic: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        id: { type: String, required: true }, // 'A', 'B', 'C', 'D'
        text: { type: String, required: true },
      },
    ],
    correctOption: {
      type: String,
      required: true, // 'A', 'B', 'C', or 'D'
    },
    explanation: {
      type: String,
      required: true,
    },
    formula: {
      type: String,
      default: '',
    },
    companyTags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ category: 1, topic: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
