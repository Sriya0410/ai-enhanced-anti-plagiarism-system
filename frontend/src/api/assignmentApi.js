import API from "./axios";

export const getAssignments = (params = {}) => {
  return API.get("/assignments", { params });
};

export const getAssignmentById = (id) => {
  return API.get(`/assignments/${id}`);
};

export const createAssignment = (payload) => {
  return API.post("/assignments", payload);
};

export const updateAssignment = (id, payload) => {
  return API.put(`/assignments/${id}`, payload);
};

export const deleteAssignment = (id) => {
  return API.delete(`/assignments/${id}`);
};

export const publishAssignment = (id) => {
  return API.patch(`/assignments/${id}/publish`);
};

export const closeAssignment = (id) => {
  return API.patch(`/assignments/${id}/close`);
};