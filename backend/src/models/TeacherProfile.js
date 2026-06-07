const mongoose = require("mongoose");

const teacherProfileSchema = new mongoose.Schema(
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

    employeeId: {
      type: String,
      unique: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    qualification: {
      type: String,
      trim: true,
      default: ""
    },

    experience: {
      type: String,
      trim: true,
      default: ""
    },

    designation: {
      type: String,
      trim: true,
      default: "Assistant Professor"
    }
  },
  {
    timestamps: true,
    collection: "teacher_profiles"
  }
);

teacherProfileSchema.pre("validate", async function (next) {
  if (this.employeeId) {
    return next();
  }

  const lastTeacher = await this.constructor
    .findOne({ employeeId: { $regex: /^TCH\d+$/ } })
    .sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastTeacher && lastTeacher.employeeId) {
    const lastNumber = parseInt(lastTeacher.employeeId.replace("TCH", ""), 10);
    nextNumber = lastNumber + 1;
  }

  this.employeeId = `TCH${String(nextNumber).padStart(3, "0")}`;

  next();
});

module.exports = mongoose.model("TeacherProfile", teacherProfileSchema);