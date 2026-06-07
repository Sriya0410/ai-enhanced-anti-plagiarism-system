import API from "./axios";

export const getSettings = () => {
  return API.get("/settings");
};

export const getSettingByKey = (key) => {
  return API.get(`/settings/${key}`);
};

export const createOrUpdateSetting = (payload) => {
  return API.post("/settings", payload);
};

export const deleteSetting = (key) => {
  return API.delete(`/settings/${key}`);
};