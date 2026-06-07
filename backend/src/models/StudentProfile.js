const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      uppercase: true,
      trim: true
    },

    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1", "2", "3", "4"]
    },

    section: {
      type: String,
      required: [true, "Section is required"],
      uppercase: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "student_profiles"
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);