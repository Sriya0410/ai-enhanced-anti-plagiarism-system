import { FILE_ALLOWED_TYPES, MAX_FILE_SIZE_MB } from "./constants";

export const validateSubmissionFile = (file) => {
  if (!file) {
    return "Please select a file.";
  }

  const fileName = file.name.toLowerCase();
  const isAllowed = FILE_ALLOWED_TYPES.some((type) => fileName.endsWith(type));

  if (!isAllowed) {
    return "Only PDF, DOCX, and TXT files are allowed.";
  }

  const fileSizeMB = file.size / (1024 * 1024);

  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return `File size must be less than ${MAX_FILE_SIZE_MB} MB.`;
  }

  return "";
};