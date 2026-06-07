import API from "./axios";

export const getStudentDashboard = () => {
  return API.get("/student/dashboard");
};

export const getMyAssignments = () => {
  return API.get("/student/assignments");
};

export const getStudentAssignmentById = (id) => {
  return API.get(`/student/assignments/${id}`);
};

export const getMySubmissions = () => {
  return API.get("/student/submissions");
};

export const getMySubmissionById = (id) => {
  return API.get(`/student/submissions/${id}`);
};

export const getMyReports = () => {
  return API.get("/student/reports");
};

export const getMyFeedback = () => {
  return API.get("/student/feedback");
};