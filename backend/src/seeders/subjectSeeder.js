const Subject = require("../models/Subject");
const Department = require("../models/Department");
const TeacherProfile = require("../models/TeacherProfile");

const subjectData = [
  {
    name: "Programming in C",
    code: "CSE101",
    departmentCode: "CSE",
    teacherEmail: "anil.cse@college.edu",
    semester: "1",
    description: "Introduction to programming concepts using C language."
  },
  {
    name: "Data Structures",
    code: "CSE201",
    departmentCode: "CSE",
    teacherEmail: "meena.cse@college.edu",
    semester: "2",
    description: "Arrays, linked lists, stacks, queues, trees, graphs, and hashing."
  },
  {
    name: "Database Management Systems",
    code: "CSE301",
    departmentCode: "CSE",
    teacherEmail: "anil.cse@college.edu",
    semester: "3",
    description: "Relational databases, SQL, normalization, transactions, and indexing."
  },
  {
    name: "Operating Systems",
    code: "CSE401",
    departmentCode: "CSE",
    teacherEmail: "meena.cse@college.edu",
    semester: "4",
    description: "Processes, memory management, file systems, scheduling, and deadlocks."
  },

  {
    name: "Artificial Intelligence",
    code: "AIML301",
    departmentCode: "AIML",
    teacherEmail: "kiran.aiml@college.edu",
    semester: "3",
    description: "Search algorithms, knowledge representation, reasoning, and intelligent agents."
  },
  {
    name: "Machine Learning",
    code: "AIML401",
    departmentCode: "AIML",
    teacherEmail: "kiran.aiml@college.edu",
    semester: "4",
    description: "Supervised learning, unsupervised learning, classification, and regression."
  },
  {
    name: "Deep Learning",
    code: "AIML501",
    departmentCode: "AIML",
    teacherEmail: "kiran.aiml@college.edu",
    semester: "5",
    description: "Neural networks, CNN, RNN, optimization, and model training."
  },

  {
    name: "Data Analytics",
    code: "DS301",
    departmentCode: "DS",
    teacherEmail: "ravi.ds@college.edu",
    semester: "3",
    description: "Data preprocessing, visualization, descriptive analytics, and insights."
  },
  {
    name: "Big Data Technologies",
    code: "DS401",
    departmentCode: "DS",
    teacherEmail: "ravi.ds@college.edu",
    semester: "4",
    description: "Hadoop, Spark, distributed processing, and big data systems."
  },
  {
    name: "Statistics for Data Science",
    code: "DS201",
    departmentCode: "DS",
    teacherEmail: "ravi.ds@college.edu",
    semester: "2",
    description: "Probability, distributions, hypothesis testing, and regression."
  },

  {
    name: "Web Technologies",
    code: "IT201",
    departmentCode: "IT",
    teacherEmail: "kavya.it@college.edu",
    semester: "2",
    description: "HTML, CSS, JavaScript, frontend development, and web basics."
  },
  {
    name: "Computer Networks",
    code: "IT301",
    departmentCode: "IT",
    teacherEmail: "kavya.it@college.edu",
    semester: "3",
    description: "Network models, protocols, IP addressing, routing, and network security basics."
  },
  {
    name: "Cloud Computing",
    code: "IT401",
    departmentCode: "IT",
    teacherEmail: "kavya.it@college.edu",
    semester: "4",
    description: "Cloud service models, virtualization, deployment, and cloud platforms."
  },
  {
    name: "DevOps Engineering",
    code: "IT402",
    departmentCode: "IT",
    teacherEmail: "kavya.it@college.edu",
    semester: "4",
    description: "CI/CD, containers, deployment pipelines, monitoring, and automation."
  },
  {
    name: "Mobile Application Development",
    code: "IT501",
    departmentCode: "IT",
    teacherEmail: "kavya.it@college.edu",
    semester: "5",
    description: "Mobile application design, APIs, Android basics, and deployment."
  },

  {
    name: "Cyber Security Fundamentals",
    code: "CYBER301",
    departmentCode: "CYBER",
    teacherEmail: "arjun.cyber@college.edu",
    semester: "3",
    description: "Security principles, threats, vulnerabilities, attacks, and defenses."
  },
  {
    name: "Ethical Hacking",
    code: "CYBER401",
    departmentCode: "CYBER",
    teacherEmail: "arjun.cyber@college.edu",
    semester: "4",
    description: "Penetration testing, scanning, vulnerability assessment, and ethical hacking tools."
  },
  {
    name: "Cryptography and Network Security",
    code: "CYBER402",
    departmentCode: "CYBER",
    teacherEmail: "arjun.cyber@college.edu",
    semester: "4",
    description: "Encryption, hashing, digital signatures, and secure communication."
  },

  {
    name: "Digital Electronics",
    code: "ECE201",
    departmentCode: "ECE",
    teacherEmail: "ramesh.ece@college.edu",
    semester: "2",
    description: "Logic gates, combinational circuits, sequential circuits, and digital systems."
  },
  {
    name: "Communication Systems",
    code: "ECE301",
    departmentCode: "ECE",
    teacherEmail: "ramesh.ece@college.edu",
    semester: "3",
    description: "Analog and digital communication, modulation, and transmission systems."
  },
  {
    name: "VLSI Design",
    code: "ECE501",
    departmentCode: "ECE",
    teacherEmail: "ramesh.ece@college.edu",
    semester: "5",
    description: "CMOS logic, circuit design, layout, and VLSI design flow."
  },

  {
    name: "Electrical Machines",
    code: "EEE301",
    departmentCode: "EEE",
    teacherEmail: "suresh.eee@college.edu",
    semester: "3",
    description: "Transformers, DC machines, induction motors, and synchronous machines."
  },
  {
    name: "Power Systems",
    code: "EEE401",
    departmentCode: "EEE",
    teacherEmail: "suresh.eee@college.edu",
    semester: "4",
    description: "Power generation, transmission, distribution, and protection systems."
  },
  {
    name: "Control Systems",
    code: "EEE501",
    departmentCode: "EEE",
    teacherEmail: "suresh.eee@college.edu",
    semester: "5",
    description: "Feedback systems, stability, controllers, and system response."
  },

  {
    name: "Engineering Mechanics",
    code: "MECH201",
    departmentCode: "MECH",
    teacherEmail: "priya.mech@college.edu",
    semester: "2",
    description: "Forces, equilibrium, friction, centroid, and dynamics."
  },
  {
    name: "Thermal Engineering",
    code: "MECH301",
    departmentCode: "MECH",
    teacherEmail: "priya.mech@college.edu",
    semester: "3",
    description: "Thermodynamics, heat engines, refrigeration, and heat transfer basics."
  },
  {
    name: "Machine Design",
    code: "MECH401",
    departmentCode: "MECH",
    teacherEmail: "priya.mech@college.edu",
    semester: "4",
    description: "Design of mechanical components, shafts, gears, bearings, and joints."
  },

  {
    name: "Surveying",
    code: "CIVIL201",
    departmentCode: "CIVIL",
    teacherEmail: "sunil.civil@college.edu",
    semester: "2",
    description: "Chain surveying, compass surveying, leveling, and total station basics."
  },
  {
    name: "Structural Analysis",
    code: "CIVIL301",
    departmentCode: "CIVIL",
    teacherEmail: "sunil.civil@college.edu",
    semester: "3",
    description: "Analysis of beams, trusses, frames, and structural systems."
  },
  {
    name: "Concrete Technology",
    code: "CIVIL401",
    departmentCode: "CIVIL",
    teacherEmail: "sunil.civil@college.edu",
    semester: "4",
    description: "Concrete materials, mix design, testing, and construction practices."
  },

  {
    name: "Advanced Java Programming",
    code: "MCA301",
    departmentCode: "MCA",
    teacherEmail: "lakshmi.mca@college.edu",
    semester: "3",
    description: "OOP, JDBC, servlets, JSP, collections, and enterprise Java basics."
  },
  {
    name: "Full Stack Web Development",
    code: "MCA401",
    departmentCode: "MCA",
    teacherEmail: "gopal.mca@college.edu",
    semester: "4",
    description: "Frontend, backend, REST APIs, authentication, database integration, and deployment."
  },
  {
    name: "Software Testing",
    code: "MCA501",
    departmentCode: "MCA",
    teacherEmail: "gopal.mca@college.edu",
    semester: "5",
    description: "Manual testing, automation basics, test cases, defects, and quality assurance."
  }
];

const seedSubjects = async () => {
  await Subject.deleteMany();

  const departments = await Department.find();
  const teacherProfiles = await TeacherProfile.find().populate(
    "user",
    "name email"
  );

  const departmentMap = {};
  const teacherMap = {};

  departments.forEach((department) => {
    departmentMap[department.code.toUpperCase()] = department._id;
  });

  teacherProfiles.forEach((profile) => {
    if (profile.user?.email) {
      teacherMap[profile.user.email.toLowerCase()] = profile.user._id;
    }
  });

  const subjectsToCreate = [];

  for (const subject of subjectData) {
    const departmentId = departmentMap[subject.departmentCode.toUpperCase()];
    const teacherId = teacherMap[subject.teacherEmail.toLowerCase()];

    if (!departmentId) {
      console.log(`Department not found for subject: ${subject.code}`);
      continue;
    }

    if (!teacherId) {
      console.log(`Teacher not found for subject: ${subject.code}`);
      continue;
    }

    subjectsToCreate.push({
      name: subject.name,
      code: subject.code.toUpperCase(),
      department: departmentId,
      teacher: teacherId,
      semester: subject.semester,
      description: subject.description,
      isActive: true
    });
  }

  const createdSubjects = await Subject.insertMany(subjectsToCreate);

  console.log(`${createdSubjects.length} subjects seeded successfully.`);

  return createdSubjects;
};

module.exports = seedSubjects;