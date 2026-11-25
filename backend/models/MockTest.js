const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['aptitude', 'reasoning', 'verbal', 'core-cs', 'coding', 'full-assessment', 'company-special'],
      required: true,
      index: true,
    },
    companyTag: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 30,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    negativeMarking: {
      type: Number,
      default: 0.25, // 0.25 negative mark per incorrect answer
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    codingProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingProblem',
      },
    ],
    instructions: {
      type: [String],
      default: [
        'Each question has one correct answer.',
        'Negative marking applies for incorrect options as specified.',
        'Test will automatically submit when the timer expires.',
        'You can flag questions to review them before final submission.',
      ],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    attemptsCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MockTest', mockTestSchema);
