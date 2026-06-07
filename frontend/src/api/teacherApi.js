import API from "./axios";

export const getTeacherDashboard = () => {
  return API.get("/teacher/dashboard");
};

export const getTeacherAnalytics = () => {
  return API.get("/teacher/analytics");
};