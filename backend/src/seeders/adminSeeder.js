const User = require("../models/User");
const AdminProfile = require("../models/AdminProfile");
const { DEFAULT_ADMIN, USER_ROLES } = require("../config/constants");

const seedAdmin = async () => {
  await AdminProfile.deleteMany();
  await User.deleteMany({ role: USER_ROLES.ADMIN });

  const admin = await User.create({
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
    role: USER_ROLES.ADMIN,
    isActive: true
  });

  await AdminProfile.create({
    user: admin._id,
    phone: "9876543210",
    designation: "System Administrator",
    permissions: [
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
  });

  console.log("Admin seeded successfully.");
  console.log("Email: admin@gmail.com");
  console.log("Password: Admin@123");

  return admin;
};

module.exports = seedAdmin;