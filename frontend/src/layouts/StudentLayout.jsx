import { Outlet } from "react-router-dom";
import {
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  UserCog
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const StudentLayout = () => {
  const links = [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "My Assignments",
      path: "/student/assignments",
      icon: ClipboardList
    },
    {
      label: "My Submissions",
      path: "/student/submissions",
      icon: FileCheck
    },
    {
      label: "Reports",
      path: "/student/reports",
      icon: ShieldCheck
    },
    {
      label: "Feedback",
      path: "/student/feedback",
      icon: MessageSquareText
    },
    {
      label: "Profile",
      path: "/student/profile",
      icon: UserCog
    }
  ];

  return (
    <div className="app-shell">
      <Sidebar title="Student Portal" links={links} />
      <div className="app-main">
        <Navbar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;