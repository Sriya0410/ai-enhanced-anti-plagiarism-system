export const ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT"
};

export const ASSIGNMENT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED"
};

export const SUBMISSION_STATUS = {
  SUBMITTED: "SUBMITTED",
  CHECKED: "CHECKED",
  EVALUATED: "EVALUATED",
  REJECTED: "REJECTED"
};

export const RISK_LEVEL = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
};

export const YEARS = [
  { label: "1st Year", value: "1" },
  { label: "2nd Year", value: "2" },
  { label: "3rd Year", value: "3" },
  { label: "4th Year", value: "4" }
];

export const SECTIONS = [
  { label: "Section A", value: "A" },
  { label: "Section B", value: "B" },
  { label: "Section C", value: "C" },
  { label: "Section D", value: "D" }
];

export const SEMESTERS = [
  { label: "Semester 1", value: "1" },
  { label: "Semester 2", value: "2" },
  { label: "Semester 3", value: "3" },
  { label: "Semester 4", value: "4" },
  { label: "Semester 5", value: "5" },
  { label: "Semester 6", value: "6" },
  { label: "Semester 7", value: "7" },
  { label: "Semester 8", value: "8" }
];

export const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Closed", value: "CLOSED" }
];

export const USER_STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false }
];

export const FILE_ALLOWED_TYPES = [".pdf", ".docx", ".txt"];

export const MAX_FILE_SIZE_MB = 10;