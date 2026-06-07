import {
  BarChart3,
  BookOpen,
  Brain,
  FileCheck,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users
} from "lucide-react";
import StatCard from "../cards/StatCard";

const AdminStats = ({ stats = {} }) => {
  const cards = [
    {
      title: "Students",
      value: stats.totalStudents || stats.students || 0,
      icon: GraduationCap
    },
    {
      title: "Teachers",
      value: stats.totalTeachers || stats.teachers || 0,
      icon: Users
    },
    {
      title: "Departments",
      value: stats.totalDepartments || stats.departments || 0,
      icon: BookOpen
    },
    {
      title: "Assignments",
      value: stats.totalAssignments || stats.assignments || 0,
      icon: FileText
    },
    {
      title: "Submissions",
      value: stats.totalSubmissions || stats.submissions || 0,
      icon: FileCheck
    },
    {
      title: "Plagiarism Reports",
      value: stats.totalPlagiarismReports || stats.plagiarismReports || 0,
      icon: ShieldCheck
    },
    {
      title: "AI Reports",
      value: stats.totalAIReports || stats.aiReports || 0,
      icon: Brain
    },
    {
      title: "Evaluated",
      value: stats.evaluatedSubmissions || stats.evaluations || 0,
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

export default AdminStats;