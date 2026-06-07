const path = require("path");
const { getFileExtension, getFileUrl } = require("../utils/fileUtils");

const buildUploadedFileData = (file) => {
  const fileType = getFileExtension(file.originalname);

  return {
    fileName: file.filename,
    originalFileName: file.originalname,
    fileUrl: getFileUrl("submissions", file.filename),
    fileType,
    fileSize: file.size,
    filePath: path.join(__dirname, "../uploads/submissions", file.filename)
  };
};

module.exports = {
  buildUploadedFileData
};