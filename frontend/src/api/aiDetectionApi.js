import API from "./axios";

export const getAIContentReports = () => {
  return API.get("/ai-detection");
};

export const getAIContentReportBySubmission = (submissionId) => {
  return API.get(`/ai-detection/submission/${submissionId}`);
};

export const getAIContentReportById = (id) => {
  return API.get(`/ai-detection/${id}`);
};