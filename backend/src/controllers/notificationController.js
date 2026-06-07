const Notification = require("../models/Notification");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user._id
  }).sort({ createdAt: -1 });

  return apiResponse(res, 200, "Notifications fetched successfully.", {
    notifications
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  notification.isRead = true;
  await notification.save();

  return apiResponse(res, 200, "Notification marked as read.", {
    notification
  });
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      recipient: req.user._id,
      isRead: false
    },
    {
      isRead: true
    }
  );

  return apiResponse(res, 200, "All notifications marked as read.");
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  await Notification.deleteOne({ _id: notification._id });

  return apiResponse(res, 200, "Notification deleted successfully.");
});

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};