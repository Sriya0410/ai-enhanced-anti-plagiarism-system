import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  FileCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCog,
  Users
} from "lucide-react";
import Sidebar from "../common/Sidebar";

const AdminSidebar = () => {
  const links = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Students",
      path: "/admin/students",
      icon: GraduationCap
    },
    {
      label: "Teachers",
      path: "/admin/teachers",
      icon: Users
    },
    {
      label: "Departments",
      path: "/admin/departments",
      icon: BookOpen
    },
    {
      label: "Subjects",
      path: "/admin/subjects",
      icon: ClipboardList
    },
    {
      label: "Assignments",
      path: "/admin/assignments",
      icon: FileText
    },
    {
      label: "Submissions",
      path: "/admin/submissions",
      icon: FileCheck
    },
    {
      label: "Plagiarism Reports",
      path: "/admin/plagiarism-reports",
      icon: ShieldCheck
    },
    {
      label: "AI Reports",
      path: "/admin/ai-content-reports",
      icon: Brain
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings
    },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: UserCog
    }
  ];

  return <Sidebar title="Admin Panel" links={links} />;
};

export default AdminSidebar;