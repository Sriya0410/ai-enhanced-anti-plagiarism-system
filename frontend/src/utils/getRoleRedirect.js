import { ROLES } from "./constants";

const getRoleRedirect = (role) => {
  if (role === ROLES.ADMIN) {
    return "/admin/dashboard";
  }

  if (role === ROLES.TEACHER) {
    return "/teacher/dashboard";
  }

  if (role === ROLES.STUDENT) {
    return "/student/dashboard";
  }

  return "/login";
};

export default getRoleRedirect;