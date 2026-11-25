const mongoose = require('mongoose');

const prepProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    streakDays: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    completedQuestionsCount: {
      type: Number,
      default: 0,
    },
    correctQuestionsCount: {
      type: Number,
      default: 0,
    },
    categoryStats: {
      aptitude: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      reasoning: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      verbal: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      coreCs: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      coding: { solved: { type: Number, default: 0 }, attempted: { type: Number, default: 0 } },
    },
    weakTopics: {
      type: [String],
      default: [],
    },
    dailyChallenge: {
      date: { type: String, default: () => new Date().toISOString().split('T')[0] },
      targetQuestions: { type: Number, default: 5 },
      completedQuestions: { type: Number, default: 0 },
      isCompleted: { type: Boolean, default: false },
    },
    upcomingGoals: [
      {
        title: { type: String, required: true },
        targetDate: { type: Date },
        isCompleted: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PrepProgress', prepProgressSchema);
