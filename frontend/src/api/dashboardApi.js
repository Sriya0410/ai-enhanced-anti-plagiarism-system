import API from "./axios";

export const getDashboard = () => {
  return API.get("/dashboard");
};

export const getSystemAnalytics = () => {
  return API.get("/dashboard/analytics");
};