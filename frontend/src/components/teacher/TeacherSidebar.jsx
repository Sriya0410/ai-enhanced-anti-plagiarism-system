import {
  BarChart3,
  ClipboardList,
  FileCheck,
  FilePlus2,
  LayoutDashboard,
  UserCog
} from "lucide-react";
import Sidebar from "../common/Sidebar";

const TeacherSidebar = () => {
  const links = [
    {
      label: "Dashboard",
      path: "/teacher/dashboard",
      icon: LayoutDashboard,
      exact: true
    },
    {
      label: "Create Assignment",
      path: "/teacher/assignments/create",
      icon: FilePlus2,
      exact: true
    },
    {
      label: "My Assignments",
      path: "/teacher/assignments",
      icon: ClipboardList,
      exact: true
    },
    {
      label: "Submissions",
      path: "/teacher/submissions",
      icon: FileCheck,
      exact: false
    },
    {
      label: "Analytics",
      path: "/teacher/analytics",
      icon: BarChart3,
      exact: true
    },
    {
      label: "Profile",
      path: "/teacher/profile",
      icon: UserCog,
      exact: true
    }
  ];

  return <Sidebar title="Teacher Portal" links={links} />;
};

export default TeacherSidebar;