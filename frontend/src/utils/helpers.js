export const normalizeList = (response, key) => {
  return response?.data?.data?.[key] || [];
};

export const normalizeItem = (response, key) => {
  return response?.data?.data?.[key] || null;
};

const isMongoId = (value) => {
  return typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);
};

export const getDepartmentName = (department) => {
  if (!department) {
    return "N/A";
  }

  if (typeof department === "string") {
    return isMongoId(department) ? "Not loaded" : department;
  }

  if (department.name && department.code) {
    return department.name;
  }

  return department.name || department.code || "N/A";
};

export const getDepartmentCode = (department) => {
  if (!department) {
    return "N/A";
  }

  if (typeof department === "string") {
    return isMongoId(department) ? "Not loaded" : department;
  }

  return department.code || "N/A";
};

export const getSubjectName = (subject) => {
  if (!subject) {
    return "N/A";
  }

  if (typeof subject === "string") {
    return isMongoId(subject) ? "Not loaded" : subject;
  }

  if (subject.name && subject.code) {
    return subject.name;
  }

  return subject.name || subject.code || "N/A";
};

export const getSubjectCode = (subject) => {
  if (!subject) {
    return "N/A";
  }

  if (typeof subject === "string") {
    return isMongoId(subject) ? "Not loaded" : subject;
  }

  return subject.code || "N/A";
};

export const getUserName = (user) => {
  if (!user) {
    return "N/A";
  }

  if (typeof user === "string") {
    return isMongoId(user) ? "Not loaded" : user;
  }

  return user.name || user.fullName || user.email || "N/A";
};

export const getUserEmail = (user) => {
  if (!user) {
    return "N/A";
  }

  if (typeof user === "string") {
    return isMongoId(user) ? "Not loaded" : user;
  }

  return user.email || "N/A";
};

export const getFileName = (item) => {
  if (!item) {
    return "N/A";
  }

  if (typeof item === "string") {
    return item;
  }

  return item.originalFileName || item.fileName || item.name || "N/A";
};

export const getRiskText = (score) => {
  const value = Number(score || 0);

  if (value >= 70) {
    return "HIGH";
  }

  if (value >= 35) {
    return "MEDIUM";
  }

  return "LOW";
};

export const getInitials = (name = "") => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "NA";
};

export const truncateText = (text = "", limit = 80) => {
  if (!text) {
    return "";
  }

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit)}...`;
};

export const formatPercentage = (value) => {
  return `${Number(value || 0)}%`;
};

export const safeValue = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
};