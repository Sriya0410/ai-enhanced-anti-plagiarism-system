import {
  ClipboardList,
  FileCheck,
  MessageSquareText,
  ShieldCheck
} from "lucide-react";
import StatCard from "../cards/StatCard";

const StudentStats = ({ stats = {} }) => {
  const cards = [
    {
      title: "Assignments",
      value: stats.totalAssignments || stats.assignments || 0,
      icon: ClipboardList
    },
    {
      title: "Submitted",
      value: stats.totalSubmissions || stats.submissions || 0,
      icon: FileCheck
    },
    {
      title: "Checked",
      value: stats.checkedSubmissions || stats.checked || 0,
      icon: ShieldCheck
    },
    {
      title: "Evaluated",
      value: stats.evaluatedSubmissions || stats.evaluated || 0,
      icon: MessageSquareText
    }
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default StudentStats;