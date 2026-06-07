import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

import { ROLES } from "../utils/constants";

import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import StudentLayout from "../layouts/StudentLayout";

import LandingPage from "../pages/common/LandingPage";
import LoginPage from "../pages/common/LoginPage";
import RegisterPage from "../pages/common/RegisterPage";
import UnauthorizedPage from "../pages/common/UnauthorizedPage";
import NotFoundPage from "../pages/common/NotFoundPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageStudents from "../pages/admin/ManageStudents";
import ManageTeachers from "../pages/admin/ManageTeachers";
import ManageDepartments from "../pages/admin/ManageDepartments";
import ManageSubjects from "../pages/admin/ManageSubjects";
import AllAssignments from "../pages/admin/AllAssignments";
import AllSubmissions from "../pages/admin/AllSubmissions";
import PlagiarismReports from "../pages/admin/PlagiarismReports";
import AIContentReports from "../pages/admin/AIContentReports";
import SystemAnalytics from "../pages/admin/SystemAnalytics";
import SystemSettings from "../pages/admin/SystemSettings";
import AdminProfile from "../pages/admin/AdminProfile";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import CreateAssignment from "../pages/teacher/CreateAssignment";
import ManageAssignments from "../pages/teacher/ManageAssignments";
import EditAssignment from "../pages/teacher/EditAssignment";
import ViewSubmissions from "../pages/teacher/ViewSubmissions";
import TeacherSubmissionDetails from "../pages/teacher/SubmissionDetails";
import TeacherPlagiarismReport from "../pages/teacher/PlagiarismReport";
import TeacherAIContentReport from "../pages/teacher/AIContentReport";
import EvaluateSubmission from "../pages/teacher/EvaluateSubmission";
import TeacherAnalytics from "../pages/teacher/TeacherAnalytics";
import TeacherProfile from "../pages/teacher/TeacherProfile";

import StudentDashboard from "../pages/student/StudentDashboard";
import MyAssignments from "../pages/student/MyAssignments";
import AssignmentDetails from "../pages/student/AssignmentDetails";
import SubmitAssignment from "../pages/student/SubmitAssignment";
import MySubmissions from "../pages/student/MySubmissions";
import StudentSubmissionDetails from "../pages/student/SubmissionDetails";
import MyReports from "../pages/student/MyReports";
import FeedbackPage from "../pages/student/FeedbackPage";
import StudentProfile from "../pages/student/StudentProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="departments" element={<ManageDepartments />} />
            <Route path="subjects" element={<ManageSubjects />} />
            <Route path="assignments" element={<AllAssignments />} />
            <Route path="submissions" element={<AllSubmissions />} />
            <Route path="plagiarism-reports" element={<PlagiarismReports />} />
            <Route path="ai-content-reports" element={<AIContentReports />} />
            <Route path="analytics" element={<SystemAnalytics />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={[ROLES.TEACHER]} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />

            <Route path="assignments/create" element={<CreateAssignment />} />
            <Route path="assignments" element={<ManageAssignments />} />
            <Route path="assignments/:id/edit" element={<EditAssignment />} />

            <Route
              path="assignments/:assignmentId/submissions"
              element={<ViewSubmissions />}
            />

            <Route path="submissions" element={<ViewSubmissions />} />
            <Route path="submissions/:id" element={<TeacherSubmissionDetails />} />
            <Route
              path="submissions/:id/plagiarism"
              element={<TeacherPlagiarismReport />}
            />
            <Route
              path="submissions/:id/ai-content"
              element={<TeacherAIContentReport />}
            />
            <Route
              path="submissions/:id/evaluate"
              element={<EvaluateSubmission />}
            />

            <Route path="analytics" element={<TeacherAnalytics />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />

            <Route path="assignments" element={<MyAssignments />} />
            <Route path="assignments/:id" element={<AssignmentDetails />} />
            <Route path="assignments/:id/submit" element={<SubmitAssignment />} />

            <Route path="submissions" element={<MySubmissions />} />
            <Route path="submissions/:id" element={<StudentSubmissionDetails />} />

            <Route path="reports" element={<MyReports />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;