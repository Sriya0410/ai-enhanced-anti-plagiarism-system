const SystemSetting = require("../models/SystemSetting");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const getSettings = asyncHandler(async (req, res) => {
  const settings = await SystemSetting.find().sort({ key: 1 });

  return apiResponse(res, 200, "Settings fetched successfully.", {
    settings
  });
});

const getSettingByKey = asyncHandler(async (req, res) => {
  const setting = await SystemSetting.findOne({
    key: req.params.key
  });

  if (!setting) {
    throw new ApiError(404, "Setting not found.");
  }

  return apiResponse(res, 200, "Setting fetched successfully.", {
    setting
  });
});

const createOrUpdateSetting = asyncHandler(async (req, res) => {
  const { key, value, description } = req.body;

  if (!key || value === undefined) {
    throw new ApiError(400, "Key and value are required.");
  }

  const setting = await SystemSetting.findOneAndUpdate(
    { key },
    {
      key,
      value,
      description
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  return apiResponse(res, 200, "Setting saved successfully.", {
    setting
  });
});

const deleteSetting = asyncHandler(async (req, res) => {
  const setting = await SystemSetting.findOne({
    key: req.params.key
  });

  if (!setting) {
    throw new ApiError(404, "Setting not found.");
  }

  await SystemSetting.deleteOne({ _id: setting._id });

  return apiResponse(res, 200, "Setting deleted successfully.");
});

module.exports = {
  getSettings,
  getSettingByKey,
  createOrUpdateSetting,
  deleteSetting
};