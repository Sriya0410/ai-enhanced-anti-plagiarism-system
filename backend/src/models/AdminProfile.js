const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    designation: {
      type: String,
      trim: true,
      default: "System Administrator"
    },

    permissions: {
      type: [String],
      default: [
        "MANAGE_STUDENTS",
        "MANAGE_TEACHERS",
        "MANAGE_DEPARTMENTS",
        "MANAGE_SUBJECTS",
        "VIEW_ASSIGNMENTS",
        "VIEW_SUBMISSIONS",
        "VIEW_REPORTS",
        "VIEW_ANALYTICS",
        "MANAGE_SETTINGS"
      ]
    }
  },
  {
    timestamps: true,
    collection: "admin_profiles"
  }
);

module.exports = mongoose.model("AdminProfile", adminProfileSchema);