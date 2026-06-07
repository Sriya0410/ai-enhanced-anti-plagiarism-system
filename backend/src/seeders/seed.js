const dotenv = require("dotenv");
const connectDB = require("../config/db");

const User = require("../models/User");
const AdminProfile = require("../models/AdminProfile");
const TeacherProfile = require("../models/TeacherProfile");
const StudentProfile = require("../models/StudentProfile");
const Department = require("../models/Department");
const Subject = require("../models/Subject");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const PlagiarismReport = require("../models/PlagiarismReport");
const AIContentReport = require("../models/AIContentReport");
const Evaluation = require("../models/Evaluation");
const Notification = require("../models/Notification");
const SystemSetting = require("../models/SystemSetting");

const seedAdmin = require("./adminSeeder");
const seedDepartments = require("./departmentSeeder");
const seedTeachers = require("./teacherSeeder");
const seedSubjects = require("./subjectSeeder");
const seedStudents = require("./studentSeeder");

dotenv.config();

connectDB();

const clearDatabase = async () => {
  await Promise.all([
    User.deleteMany(),
    AdminProfile.deleteMany(),
    TeacherProfile.deleteMany(),
    StudentProfile.deleteMany(),
    Department.deleteMany(),
    Subject.deleteMany(),
    Assignment.deleteMany(),
    Submission.deleteMany(),
    PlagiarismReport.deleteMany(),
    AIContentReport.deleteMany(),
    Evaluation.deleteMany(),
    Notification.deleteMany(),
    SystemSetting.deleteMany()
  ]);

  console.log("Old database data cleared successfully.");
};

const seedSettings = async () => {
  await SystemSetting.insertMany([
    {
      key: "plagiarismHighThreshold",
      value: 70,
      description:
        "Submissions with plagiarism score greater than or equal to this value are marked HIGH."
    },
    {
      key: "plagiarismMediumThreshold",
      value: 35,
      description:
        "Submissions with plagiarism score greater than or equal to this value are marked MEDIUM."
    },
    {
      key: "aiHighThreshold",
      value: 70,
      description:
        "Submissions with AI score greater than or equal to this value are marked HIGH."
    },
    {
      key: "aiMediumThreshold",
      value: 35,
      description:
        "Submissions with AI score greater than or equal to this value are marked MEDIUM."
    },
    {
      key: "allowedFileTypes",
      value: ["pdf", "docx", "txt"],
      description: "Allowed submission file types."
    },
    {
      key: "maxFileSizeMB",
      value: 10,
      description: "Maximum allowed upload file size in MB."
    }
  ]);

  console.log("System settings seeded successfully.");
};

const runSeeder = async () => {
  try {
    await clearDatabase();

    await seedAdmin();
    await seedDepartments();
    await seedTeachers();
    await seedSubjects();
    await seedStudents();
    await seedSettings();

    console.log("Full database seeding completed successfully.");
    console.log("----------------------------------------");

    console.log("Admin Login:");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin@123");
    console.log("----------------------------------------");

    console.log("Teacher Login Example:");
    console.log("Email: anil.cse@college.edu");
    console.log("Password: Teacher@123");
    console.log("----------------------------------------");

    console.log("Student Login Example:");
    console.log("Email: rahul.cse@college.edu");
    console.log("Password: Student@123");
    console.log("----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seeder failed:", error.message);
    process.exit(1);
  }
};

runSeeder();