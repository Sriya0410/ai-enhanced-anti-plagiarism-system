const User = require("../models/User");
const TeacherProfile = require("../models/TeacherProfile");
const Department = require("../models/Department");
const { USER_ROLES } = require("../config/constants");

const teacherData = [
  {
    name: "Dr. Anil Kumar",
    email: "anil.cse@college.edu",
    password: "Teacher@123",
    departmentCode: "CSE",
    phone: "9000000001",
    qualification: "Ph.D. in Computer Science",
    experience: "12 years",
    designation: "Professor"
  },
  {
    name: "Prof. Meena Reddy",
    email: "meena.cse@college.edu",
    password: "Teacher@123",
    departmentCode: "CSE",
    phone: "9000000002",
    qualification: "M.Tech in Computer Science",
    experience: "8 years",
    designation: "Assistant Professor"
  },
  {
    name: "Dr. Kiran Rao",
    email: "kiran.aiml@college.edu",
    password: "Teacher@123",
    departmentCode: "AIML",
    phone: "9000000003",
    qualification: "Ph.D. in Artificial Intelligence",
    experience: "11 years",
    designation: "Professor"
  },
  {
    name: "Dr. Ravi Teja",
    email: "ravi.ds@college.edu",
    password: "Teacher@123",
    departmentCode: "DS",
    phone: "9000000004",
    qualification: "Ph.D. in Data Science",
    experience: "12 years",
    designation: "Professor"
  },
  {
    name: "Prof. Kavya Nair",
    email: "kavya.it@college.edu",
    password: "Teacher@123",
    departmentCode: "IT",
    phone: "9000000005",
    qualification: "M.Tech in Information Technology",
    experience: "8 years",
    designation: "Assistant Professor"
  },
  {
    name: "Dr. Arjun Verma",
    email: "arjun.cyber@college.edu",
    password: "Teacher@123",
    departmentCode: "CYBER",
    phone: "9000000006",
    qualification: "Ph.D. in Cyber Security",
    experience: "12 years",
    designation: "Professor"
  },
  {
    name: "Dr. Ramesh Babu",
    email: "ramesh.ece@college.edu",
    password: "Teacher@123",
    departmentCode: "ECE",
    phone: "9000000007",
    qualification: "Ph.D. in Communication Systems",
    experience: "13 years",
    designation: "Professor"
  },
  {
    name: "Prof. Suresh Babu",
    email: "suresh.eee@college.edu",
    password: "Teacher@123",
    departmentCode: "EEE",
    phone: "9000000008",
    qualification: "M.Tech in Electrical Engineering",
    experience: "10 years",
    designation: "Assistant Professor"
  },
  {
    name: "Dr. Priya Menon",
    email: "priya.mech@college.edu",
    password: "Teacher@123",
    departmentCode: "MECH",
    phone: "9000000009",
    qualification: "Ph.D. in Mechanical Engineering",
    experience: "13 years",
    designation: "Professor"
  },
  {
    name: "Dr. Sunil Reddy",
    email: "sunil.civil@college.edu",
    password: "Teacher@123",
    departmentCode: "CIVIL",
    phone: "9000000010",
    qualification: "Ph.D. in Civil Engineering",
    experience: "14 years",
    designation: "Professor"
  },
  {
    name: "Dr. Lakshmi Devi",
    email: "lakshmi.mca@college.edu",
    password: "Teacher@123",
    departmentCode: "MCA",
    phone: "9000000011",
    qualification: "Ph.D. in Computer Applications",
    experience: "13 years",
    designation: "Professor"
  },
  {
    name: "Prof. Gopal Krishna",
    email: "gopal.mca@college.edu",
    password: "Teacher@123",
    departmentCode: "MCA",
    phone: "9000000012",
    qualification: "MCA, M.Tech",
    experience: "9 years",
    designation: "Assistant Professor"
  }
];

const seedTeachers = async () => {
  await TeacherProfile.deleteMany();
  await User.deleteMany({ role: USER_ROLES.TEACHER });

  const departments = await Department.find();

  const departmentMap = {};
  departments.forEach((department) => {
    departmentMap[department.code.toUpperCase()] = department._id;
  });

  const createdTeachers = [];

  for (const teacher of teacherData) {
    const departmentId = departmentMap[teacher.departmentCode.toUpperCase()];

    if (!departmentId) {
      console.log(`Department not found for teacher: ${teacher.email}`);
      continue;
    }

    const user = await User.create({
      name: teacher.name,
      email: teacher.email.toLowerCase(),
      password: teacher.password,
      role: USER_ROLES.TEACHER,
      isActive: true
    });

    const profile = await TeacherProfile.create({
      user: user._id,
      department: departmentId,
      phone: teacher.phone,
      qualification: teacher.qualification,
      experience: teacher.experience,
      designation: teacher.designation
    });

    createdTeachers.push({
      user,
      profile
    });
  }

  console.log(`${createdTeachers.length} teachers seeded successfully.`);
  console.log("All teacher passwords: Teacher@123");

  return createdTeachers;
};

module.exports = seedTeachers;