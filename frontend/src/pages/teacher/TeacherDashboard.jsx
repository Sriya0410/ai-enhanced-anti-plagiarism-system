import { useEffect, useState } from "react";
import {
  BarChart3,
  Brain,
  ClipboardList,
  FileCheck,
  FilePlus2,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getTeacherDashboard } from "../../api/teacherApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import SubmissionTable from "../../components/tables/SubmissionTable";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getTeacherDashboard();
      setStats(response?.data?.data?.stats || {});
      setRecentSubmissions(response?.data?.data?.recentSubmissions || []);
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
    return <Loader text="Loading teacher dashboard..." />;
  }

  const cards = [
    {
      title: "Assignments",
      value: stats.totalAssignments || 0,
      icon: ClipboardList,
      note: "Created by you"
    },
    {
      title: "Published",
      value: stats.publishedAssignments || 0,
      icon: FileCheck,
      note: "Visible to students"
    },
    {
      title: "Submissions",
      value: stats.totalSubmissions || 0,
      icon: ShieldCheck,
      note: "Received files"
    },
    {
      title: "Checked",
      value: stats.checkedSubmissions || 0,
      icon: Brain,
      note: "Reports ready"
    },
    {
      title: "Evaluated",
      value: stats.evaluatedSubmissions || 0,
      icon: BarChart3,
      note: "Marks given"
    }
  ];

  return (
    <div className="dashboard-page teacher-dashboard-page">
      <section className="dashboard-hero teacher-hero">
        <div>
          <p className="dashboard-kicker">Teacher Evaluation Hub</p>
          <h1>Teacher Dashboard</h1>
          <p>
            Create assignments, review student submissions, inspect plagiarism
            and AI reports, and provide marks with feedback.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/teacher/assignments/create">
              <Button>
                <FilePlus2 size={18} />
                Create Assignment
              </Button>
            </Link>

            <Link to="/teacher/assignments">
              <Button variant="secondary">Manage Assignments</Button>
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-card">
          <div className="hero-card-icon">
            <Sparkles size={30} />
          </div>
          <h3>{stats.totalSubmissions || 0}</h3>
          <p>Submissions Received</p>
          <span>Evaluate after automatic reports are generated.</span>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="premium-stat-grid teacher-grid">
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
          title="Recent Submissions"
          subtitle="Latest submissions received for your assignments."
        />

        <SubmissionTable
          submissions={recentSubmissions}
          role="TEACHER"
          onView={(submission) =>
            navigate(`/teacher/submissions/${submission._id}`)
          }
          onEvaluate={(submission) =>
            navigate(`/teacher/submissions/${submission._id}/evaluate`)
          }
          onViewReports={(submission) =>
            navigate(`/teacher/submissions/${submission._id}`)
          }
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;