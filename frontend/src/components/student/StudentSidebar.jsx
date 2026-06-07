import {
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  UserCog
} from "lucide-react";
import Sidebar from "../common/Sidebar";

const StudentSidebar = () => {
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

  return <Sidebar title="Student Portal" links={links} />;
};

export default StudentSidebar;