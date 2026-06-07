const mongoose = require("mongoose");
const { SUBMISSION_STATUS } = require("../config/constants");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    originalFileName: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    extractedText: {
      type: String,
      default: ""
    },

    plagiarismScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    aiScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    marks: {
      type: Number,
      default: null
    },

    feedback: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: Object.values(SUBMISSION_STATUS),
      default: SUBMISSION_STATUS.SUBMITTED
    },

    isLate: {
      type: Boolean,
      default: false
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);