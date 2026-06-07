const Notification = require("../models/Notification");

const createNotification = async ({ recipient, title, message, type }) => {
  if (!recipient || !title || !message) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    title,
    message,
    type
  });

  return notification;
};

const createBulkNotifications = async (notifications = []) => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return [];
  }

  const validNotifications = notifications.filter(
    (item) => item.recipient && item.title && item.message
  );

  if (validNotifications.length === 0) {
    return [];
  }

  return Notification.insertMany(validNotifications);
};

module.exports = {
  createNotification,
  createBulkNotifications
};