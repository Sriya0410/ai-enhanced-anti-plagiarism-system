const express = require("express");

const {
  createOrUpdateEvaluation,
  getEvaluations,
  getEvaluationBySubmission,
  getEvaluationById
} = require("../controllers/evaluationController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  authorizeRoles(USER_ROLES.TEACHER),
  createOrUpdateEvaluation
);

router.get(
  "/",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getEvaluations
);

router.get(
  "/submission/:submissionId",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getEvaluationBySubmission
);

router.get(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getEvaluationById
);

module.exports = router;