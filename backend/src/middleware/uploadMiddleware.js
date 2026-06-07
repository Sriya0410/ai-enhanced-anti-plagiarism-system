const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/apiError");
const { ensureDirectoryExists } = require("../utils/fileUtils");

const submissionsPath = path.join(__dirname, "../uploads/submissions");
const assignmentsPath = path.join(__dirname, "../uploads/assignments");
const reportsPath = path.join(__dirname, "../uploads/reports");

ensureDirectoryExists(submissionsPath);
ensureDirectoryExists(assignmentsPath);
ensureDirectoryExists(reportsPath);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, submissionsPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname
    )}`;

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];

  const allowedExtensions = [".pdf", ".docx", ".txt"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only PDF, DOCX, and TXT files are allowed."), false);
  }
};

const uploadSubmission = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024
  },
  fileFilter
});

module.exports = {
  uploadSubmission
};