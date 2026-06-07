const path = require("path");
const fs = require("fs");

const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const getFileExtension = (fileName = "") => {
  return path.extname(fileName).replace(".", "").toLowerCase();
};

const getFileUrl = (folder, fileName) => {
  return `/uploads/${folder}/${fileName}`;
};

const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  ensureDirectoryExists,
  getFileExtension,
  getFileUrl,
  deleteFileIfExists
};