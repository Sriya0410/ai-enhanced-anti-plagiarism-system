import API from "./axios";

export const getSubjects = (params = {}) => {
  return API.get("/subjects", { params });
};

export const getMyTeacherSubjects = () => {
  return API.get("/subjects/teacher/my-subjects");
};

export const getSubjectById = (id) => {
  return API.get(`/subjects/${id}`);
};

export const createSubject = (payload) => {
  return API.post("/subjects", payload);
};

export const updateSubject = (id, payload) => {
  return API.put(`/subjects/${id}`, payload);
};

export const deleteSubject = (id) => {
  return API.delete(`/subjects/${id}`);
};