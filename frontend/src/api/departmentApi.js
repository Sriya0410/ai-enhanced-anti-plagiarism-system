import API from "./axios";

export const getDepartments = () => {
  return API.get("/departments");
};

export const getActiveDepartments = () => {
  return API.get("/departments/active");
};

export const getDepartmentById = (id) => {
  return API.get(`/departments/${id}`);
};

export const createDepartment = (payload) => {
  return API.post("/departments", payload);
};

export const updateDepartment = (id, payload) => {
  return API.put(`/departments/${id}`, payload);
};

export const deleteDepartment = (id) => {
  return API.delete(`/departments/${id}`);
};