const Department = require("../models/Department");

const departments = [
  {
    name: "Computer Science and Engineering",
    code: "CSE",
    description:
      "Software development, algorithms, databases, operating systems, and computer networks.",
    isActive: true
  },
  {
    name: "Artificial Intelligence and Machine Learning",
    code: "AIML",
    description:
      "Artificial intelligence, machine learning, deep learning, and intelligent systems.",
    isActive: true
  },
  {
    name: "Data Science",
    code: "DS",
    description:
      "Data analytics, statistics, big data, visualization, and predictive modeling.",
    isActive: true
  },
  {
    name: "Information Technology",
    code: "IT",
    description:
      "Web technologies, cloud computing, mobile applications, and information systems.",
    isActive: true
  },
  {
    name: "Cyber Security",
    code: "CYBER",
    description:
      "Network security, ethical hacking, cryptography, and digital forensics.",
    isActive: true
  },
  {
    name: "Electronics and Communication Engineering",
    code: "ECE",
    description:
      "Communication systems, embedded systems, VLSI, and signal processing.",
    isActive: true
  },
  {
    name: "Electrical and Electronics Engineering",
    code: "EEE",
    description:
      "Electrical machines, power systems, control systems, and power electronics.",
    isActive: true
  },
  {
    name: "Mechanical Engineering",
    code: "MECH",
    description:
      "Thermal engineering, machine design, manufacturing, and automobile systems.",
    isActive: true
  },
  {
    name: "Civil Engineering",
    code: "CIVIL",
    description:
      "Structural engineering, surveying, transportation, and environmental engineering.",
    isActive: true
  },
  {
    name: "Master of Computer Applications",
    code: "MCA",
    description:
      "Advanced computer applications, full-stack development, software testing, and programming.",
    isActive: true
  }
];

const seedDepartments = async () => {
  await Department.deleteMany();

  const createdDepartments = await Department.insertMany(departments);

  console.log(`${createdDepartments.length} departments seeded successfully.`);

  return createdDepartments;
};

module.exports = seedDepartments;