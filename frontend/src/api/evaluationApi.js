import API from "./axios";

export const createOrUpdateEvaluation = (payload) => {
  return API.post("/evaluations", payload);
};

export const getEvaluations = (params = {}) => {
  return API.get("/evaluations", { params });
};

export const getEvaluationBySubmission = (submissionId) => {
  return API.get(`/evaluations/submission/${submissionId}`);
};

export const getEvaluationById = (id) => {
  return API.get(`/evaluations/${id}`);
};