const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { getFileExtension } = require("../utils/fileUtils");
const { cleanText } = require("../utils/textCleaner");
const ApiError = require("../utils/apiError");

const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  return cleanText(data.text || "");
};

const extractTextFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });

  return cleanText(result.value || "");
};

const extractTextFromTXT = async (filePath) => {
  const text = fs.readFileSync(filePath, "utf-8");

  return cleanText(text || "");
};

const extractTextFromFile = async (filePath, originalFileName) => {
  const extension = getFileExtension(originalFileName);

  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, "Uploaded file not found.");
  }

  let extractedText = "";

  if (extension === "pdf") {
    extractedText = await extractTextFromPDF(filePath);
  } else if (extension === "docx") {
    extractedText = await extractTextFromDOCX(filePath);
  } else if (extension === "txt") {
    extractedText = await extractTextFromTXT(filePath);
  } else {
    throw new ApiError(400, "Unsupported file type.");
  }

  if (!extractedText || extractedText.trim().length === 0) {
    throw new ApiError(400, "Could not extract text from uploaded file.");
  }

  return extractedText;
};

module.exports = {
  extractTextFromFile
};