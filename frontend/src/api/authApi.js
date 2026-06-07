import API from "./axios";

export const registerStudent = (payload) => {
  return API.post("/auth/register", payload);
};

export const loginUser = (payload) => {
  return API.post("/auth/login", payload);
};

export const getMe = () => {
  return API.get("/auth/me");
};

export const updateMyProfile = (payload) => {
  return API.put("/auth/profile", payload);
};

export const changePassword = (payload) => {
  return API.put("/auth/change-password", payload);
};