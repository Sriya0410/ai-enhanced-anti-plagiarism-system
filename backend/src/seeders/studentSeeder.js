const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Department = require("../models/Department");
const { USER_ROLES } = require("../config/constants");

const studentData = [
  {
    name: "Rahul Varma",
    email: "rahul.mca@student.edu",
    password: "Student@123",
    departmentCode: "MCA",
    rollNumber: "MCA001",
    year: "1",
    section: "A",
    phone: "9100000001"
  },
  {
    name: "Priya Sharma",
    email: "priya.mca@student.edu",
    password: "Student@123",
    departmentCode: "MCA",
    rollNumber: "MCA002",
    year: "1",
    section: "A",
    phone: "9100000002"
  },
  {
    name: "Arjun Reddy",
    email: "arjun.cse@student.edu",
    password: "Student@123",
    departmentCode: "CSE",
    rollNumber: "CSE001",
    year: "2",
    section: "B",
    phone: "9100000003"
  },
  {
    name: "Sneha Nair",
    email: "sneha.cse@student.edu",
    password: "Student@123",
    departmentCode: "CSE",
    rollNumber: "CSE002",
    year: "2",
    section: "B",
    phone: "9100000004"
  },
  {
    name: "Kiran Kumar",
    email: "kiran.aiml@student.edu",
    password: "Student@123",
    departmentCode: "AIML",
    rollNumber: "AIML001",
    year: "3",
    section: "A",
    phone: "9100000005"
  },
  {
    name: "Divya Singh",
    email: "divya.ds@student.edu",
    password: "Student@123",
    departmentCode: "DS",
    rollNumber: "DS001",
    year: "3",
    section: "A",
    phone: "9100000006"
  },

  {
    name: "R. Sriya Sree",
    email: "sriya.it@student.edu",
    password: "Student@123",
    departmentCode: "IT",
    rollNumber: "IT001",
    year: "4",
    section: "A",
    phone: "9100000007"
  },
  {
    name: "A. Mounika",
    email: "mounika.it@student.edu",
    password: "Student@123",
    departmentCode: "IT",
    rollNumber: "IT002",
    year: "4",
    section: "A",
    phone: "9100000008"
  },
  {
    name: "Sai Teja",
    email: "saiteja.it@student.edu",
    password: "Student@123",
    departmentCode: "IT",
    rollNumber: "IT003",
    year: "3",
    section: "B",
    phone: "9100000009"
  },
  {
    name: "Nandini Rao",
    email: "nandini.it@student.edu",
    password: "Student@123",
    departmentCode: "IT",
    rollNumber: "IT004",
    year: "2",
    section: "A",
    phone: "9100000010"
  },

  {
    name: "Vikram Cyber",
    email: "vikram.cyber@student.edu",
    password: "Student@123",
    departmentCode: "CYBER",
    rollNumber: "CYBER001",
    year: "4",
    section: "A",
    phone: "9100000011"
  },
  {
    name: "Harika MCA",
    email: "harika.mca@student.edu",
    password: "Student@123",
    departmentCode: "MCA",
    rollNumber: "MCA003",
    year: "2",
    section: "B",
    phone: "9100000012"
  }
];

const seedStudents = async () => {
  await StudentProfile.deleteMany();
  await User.deleteMany({ role: USER_ROLES.STUDENT });

  const departments = await Department.find();

  const departmentMap = {};
  departments.forEach((department) => {
    departmentMap[department.code.toUpperCase()] = department._id;
  });

  const createdStudents = [];

  for (const student of studentData) {
    const departmentId = departmentMap[student.departmentCode.toUpperCase()];

    if (!departmentId) {
      console.log(`Department not found for student: ${student.email}`);
      continue;
    }

    const user = await User.create({
      name: student.name,
      email: student.email.toLowerCase(),
      password: student.password,
      role: USER_ROLES.STUDENT,
      isActive: true
    });

    const profile = await StudentProfile.create({
      user: user._id,
      department: departmentId,
      rollNumber: student.rollNumber.toUpperCase(),
      year: student.year,
      section: student.section.toUpperCase(),
      phone: student.phone
    });

    createdStudents.push({
      user,
      profile
    });
  }

  console.log(`${createdStudents.length} students seeded successfully.`);
  console.log("All student passwords: Student@123");

  return createdStudents;
};

module.exports = seedStudents;