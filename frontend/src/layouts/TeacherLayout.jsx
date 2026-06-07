import { Outlet } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  FileCheck,
  FilePlus2,
  LayoutDashboard,
  UserCog
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const TeacherLayout = () => {
  const links = [
    {
      label: "Dashboard",
      path: "/teacher/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Create Assignment",
      path: "/teacher/assignments/create",
      icon: FilePlus2
    },
    {
      label: "My Assignments",
      path: "/teacher/assignments",
      icon: ClipboardList
    },
    {
      label: "Submissions",
      path: "/teacher/submissions",
      icon: FileCheck
    },
    {
      label: "Analytics",
      path: "/teacher/analytics",
      icon: BarChart3
    },
    {
      label: "Profile",
      path: "/teacher/profile",
      icon: UserCog
    }
  ];

  return (
    <div className="app-shell">
      <Sidebar title="Teacher Portal" links={links} />

      <div className="app-main">
        <Navbar />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;