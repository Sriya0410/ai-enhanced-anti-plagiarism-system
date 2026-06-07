import {
  BarChart3,
  Brain,
  ClipboardList,
  FileCheck,
  ShieldCheck
} from "lucide-react";
import StatCard from "../cards/StatCard";

const TeacherStats = ({ stats = {} }) => {
  const cards = [
    {
      title: "Assignments",
      value: stats.totalAssignments || stats.assignments || 0,
      icon: ClipboardList
    },
    {
      title: "Published",
      value: stats.publishedAssignments || stats.published || 0,
      icon: FileCheck
    },
    {
      title: "Submissions",
      value: stats.totalSubmissions || stats.submissions || 0,
      icon: ShieldCheck
    },
    {
      title: "Checked",
      value: stats.checkedSubmissions || stats.checked || 0,
      icon: Brain
    },
    {
      title: "Evaluated",
      value: stats.evaluatedSubmissions || stats.evaluated || 0,
      icon: BarChart3
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

export default TeacherStats;