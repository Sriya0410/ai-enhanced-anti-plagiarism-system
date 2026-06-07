const ApiError = require("../utils/apiError");

const authorizeRoles = (...roles) => {
  return function (req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, "Not authorized."));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied for this role."));
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};