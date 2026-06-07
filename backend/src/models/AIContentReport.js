const mongoose = require("mongoose");
const { RISK_LEVEL } = require("../config/constants");

const aiContentReportSchema = new mongoose.Schema(
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

    aiScore: {
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

    summary: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "ai_content_reports"
  }
);

module.exports = mongoose.model("AIContentReport", aiContentReportSchema);