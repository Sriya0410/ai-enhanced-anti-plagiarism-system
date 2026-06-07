const mongoose = require("mongoose");
const { ASSIGNMENT_STATUS } = require("../config/constants");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Assignment description is required"],
      trim: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1", "2", "3", "4"]
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"]
    },

    maxMarks: {
      type: Number,
      required: [true, "Maximum marks are required"],
      min: 1,
      default: 100
    },

    status: {
      type: String,
      enum: Object.values(ASSIGNMENT_STATUS),
      default: ASSIGNMENT_STATUS.DRAFT
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);