import API from "./axios";

export const getAdminDashboard = () => {
  return API.get("/admin/dashboard");
};

export const createUserByAdmin = (payload) => {
  return API.post("/admin/users", payload);
};

export const getAllUsers = () => {
  return API.get("/admin/users");
};

export const getAllStudents = () => {
  return API.get("/admin/students");
};

export const getAllTeachers = () => {
  return API.get("/admin/teachers");
};

export const getUserById = (id) => {
  return API.get(`/admin/users/${id}`);
};

export const updateUserByAdmin = (id, payload) => {
  return API.put(`/admin/users/${id}`, payload);
};

export const deleteUserByAdmin = (id) => {
  return API.delete(`/admin/users/${id}`);
};

export const toggleUserStatus = (id) => {
  return API.patch(`/admin/users/${id}/toggle-status`);
};