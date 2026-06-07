import API from "./axios";

export const submitAssignment = (formData) => {
  return API.post("/submissions", formData);
};

export const getSubmissions = (params = {}) => {
  return API.get("/submissions", { params });
};

export const getSubmissionById = (id) => {
  return API.get(`/submissions/${id}`);
};

export const getSubmissionsByAssignment = (assignmentId) => {
  return API.get(`/submissions/assignment/${assignmentId}`);
};

export const getAllReportsForSubmission = (id) => {
  return API.get(`/submissions/${id}/reports`);
};