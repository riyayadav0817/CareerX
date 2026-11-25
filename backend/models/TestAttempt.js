const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mockTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        selectedOption: { type: String, default: '' },
        isCorrect: { type: Boolean, default: false },
        isMarkedForReview: { type: Boolean, default: false },
        timeSpentSeconds: { type: Number, default: 0 },
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    attemptedCount: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    wrongCount: {
      type: Number,
      default: 0,
    },
    unansweredCount: {
      type: Number,
      default: 0,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

testAttemptSchema.index({ user: 1, mockTest: 1 });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
