const ApiError = require("../utils/apiError");

const validateRequiredFields = (fields = []) => {
  return function (req, res, next) {
    const missingFields = [];

    fields.forEach((field) => {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return next(
        new ApiError(
          400,
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }

    next();
  };
};

const validateMongoId = (paramName = "id") => {
  return function (req, res, next) {
    const id = req.params[paramName];

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return next(new ApiError(400, `Invalid ${paramName}.`));
    }

    next();
  };
};

const validateAllowedValues = (field, allowedValues = []) => {
  return function (req, res, next) {
    const value = req.body[field];

    if (value !== undefined && !allowedValues.includes(value)) {
      return next(
        new ApiError(
          400,
          `${field} must be one of: ${allowedValues.join(", ")}`
        )
      );
    }

    next();
  };
};

module.exports = {
  validateRequiredFields,
  validateMongoId,
  validateAllowedValues
};