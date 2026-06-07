import API from "./axios";

export const getPlagiarismReports = () => {
  return API.get("/plagiarism");
};

export const getPlagiarismReportBySubmission = (submissionId) => {
  return API.get(`/plagiarism/submission/${submissionId}`);
};

export const getPlagiarismReportById = (id) => {
  return API.get(`/plagiarism/${id}`);
};