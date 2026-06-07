const SystemSetting = require("../models/SystemSetting");

const settings = [
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
    description: "Allowed file types for assignment submissions."
  },
  {
    key: "maxFileSizeMB",
    value: 10,
    description: "Maximum allowed upload file size in MB."
  },
  {
    key: "allowLateSubmission",
    value: true,
    description:
      "If true, students can submit after due date, but submission will be marked as late."
  },
  {
    key: "systemName",
    value: "AI-Enhanced Anti-Plagiarism Assignment Submission System",
    description: "Application display name."
  },
  {
    key: "reportGenerationMode",
    value: "AUTOMATIC",
    description:
      "Reports are generated automatically when a student submits an assignment."
  }
];

const seedSettings = async () => {
  await SystemSetting.deleteMany();

  const createdSettings = await SystemSetting.insertMany(settings);

  console.log(`${createdSettings.length} system settings seeded successfully.`);

  return createdSettings;
};

module.exports = seedSettings;