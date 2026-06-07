const mongoose = require("mongoose");
const { RISK_LEVEL } = require("../config/constants");

const matchedSubmissionSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission"
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    similarity: {
      type: Number,
      default: 0
    },

    matchedText: {
      type: String,
      default: ""
    }
  },
  {
    _id: false
  }
);

const plagiarismReportSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true
    },

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

    similarityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    level: {
      type: String,
      enum: Object.values(RISK_LEVEL),
      default: RISK_LEVEL.LOW
    },

    matchedSubmissions: {
      type: [matchedSubmissionSchema],
      default: []
    },

    summary: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "plagiarism_reports"
  }
);

module.exports = mongoose.model("PlagiarismReport", plagiarismReportSchema);