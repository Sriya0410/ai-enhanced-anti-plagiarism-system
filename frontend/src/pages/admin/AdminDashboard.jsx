import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  FileCheck,
  FileText,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
  UserCog
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../api/adminApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import AssignmentTable from "../../components/tables/AssignmentTable";
import SubmissionTable from "../../components/tables/SubmissionTable";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await getAdminDashboard();
      const data = response?.data?.data || {};

      setStats(data.stats || {});
      setRecentAssignments(data.recentAssignments || []);
      setRecentSubmissions(data.recentSubmissions || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader text="Loading admin dashboard..." />;
  }

  const cards = [
    {
      title: "Students",
      value: stats?.totalStudents || 0,
      icon: GraduationCap,
      note: "Registered learners"
    },
    {
      title: "Teachers",
      value: stats?.totalTeachers || 0,
      icon: Users,
      note: "Faculty accounts"
    },
    {
      title: "Departments",
      value: stats?.totalDepartments || 0,
      icon: BookOpen,
      note: "Academic branches"
    },
    {
      title: "Subjects",
      value: stats?.totalSubjects || 0,
      icon: FileText,
      note: "Mapped subjects"
    },
    {
      title: "Assignments",
      value: stats?.totalAssignments || 0,
      icon: FileText,
      note: "Created tasks"
    },
    {
      title: "Submissions",
      value: stats?.totalSubmissions || 0,
      icon: FileCheck,
      note: "Student uploads"
    },
    {
      title: "Plagiarism Reports",
      value: stats?.totalPlagiarismReports || 0,
      icon: ShieldCheck,
      note: "Similarity checks"
    },
    {
      title: "AI Reports",
      value: stats?.totalAIReports || 0,
      icon: Brain,
      note: "AI writing checks"
    },
    {
      title: "Evaluated",
      value: stats?.evaluatedSubmissions || 0,
      icon: BarChart3,
      note: "Marked submissions"
    }
  ];

  return (
    <div className="dashboard-page admin-dashboard-page">
      <section className="dashboard-hero admin-hero">
        <div>
          <p className="dashboard-kicker">Admin Control Center</p>
          <h1>Admin Dashboard</h1>
          <p>
            Monitor users, departments, assignments, submissions, reports, and
            academic integrity activity from one place.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/admin/students">
              <Button>Manage Students</Button>
            </Link>

            <Link to="/admin/analytics">
              <Button variant="secondary">View Analytics</Button>
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-card">
          <div className="hero-card-icon">
            <TrendingUp size={30} />
          </div>
          <h3>{stats?.totalSubmissions || 0}</h3>
          <p>Total Submissions Tracked</p>
          <span>Reports and evaluations update automatically.</span>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="premium-stat-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="premium-stat-card" key={card.title}>
              <div className="premium-stat-icon">
                <Icon size={25} />
              </div>

              <div>
                <p>{card.title}</p>
                <h2>{card.value}</h2>
                <span>{card.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      

      <div className="section-block">
        <PageHeader
          title="Recent Assignments"
          subtitle="Latest assignments created across all departments."
          actions={
            <Link to="/admin/assignments">
              <Button variant="secondary">View All</Button>
            </Link>
          }
        />

        <AssignmentTable
          assignments={recentAssignments}
          role="ADMIN"
          onView={(assignment) =>
            navigate(`/admin/assignments?id=${assignment._id}`)
          }
        />
      </div>

      <div className="section-block">
        <PageHeader
          title="Recent Submissions"
          subtitle="Latest student submissions with plagiarism and AI report status."
          actions={
            <Link to="/admin/submissions">
              <Button variant="secondary">View All</Button>
            </Link>
          }
        />

        <SubmissionTable
          submissions={recentSubmissions}
          role="ADMIN"
          onView={(submission) =>
            navigate(`/admin/submissions?id=${submission._id}`)
          }
          onViewReports={(submission) =>
            navigate(`/admin/plagiarism-reports?submission=${submission._id}`)
          }
        />
      </div>
    </div>
  );
};

export default AdminDashboard;