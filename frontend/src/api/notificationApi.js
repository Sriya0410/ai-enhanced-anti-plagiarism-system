import API from "./axios";

export const getMyNotifications = () => {
  return API.get("/notifications");
};

export const markNotificationAsRead = (id) => {
  return API.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
  return API.patch("/notifications/read-all");
};

export const deleteNotification = (id) => {
  return API.delete(`/notifications/${id}`);
};