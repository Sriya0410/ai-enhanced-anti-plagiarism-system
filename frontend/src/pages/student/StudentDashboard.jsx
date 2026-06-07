import { useEffect, useState } from "react";
import {
  ClipboardList,
  FileCheck,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UploadCloud
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getStudentDashboard } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import AssignmentTable from "../../components/tables/AssignmentTable";
import SubmissionTable from "../../components/tables/SubmissionTable";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await getStudentDashboard();

      setStats(response?.data?.data?.stats || {});
      setRecentAssignments(response?.data?.data?.recentAssignments || []);
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
    return <Loader text="Loading student dashboard..." />;
  }

  const cards = [
    {
      title: "Assignments",
      value: stats.totalAssignments || 0,
      icon: ClipboardList,
      note: "Available tasks"
    },
    {
      title: "Submitted",
      value: stats.totalSubmissions || 0,
      icon: FileCheck,
      note: "Uploaded work"
    },
    {
      title: "Checked",
      value: stats.checkedSubmissions || 0,
      icon: ShieldCheck,
      note: "Reports generated"
    },
    {
      title: "Evaluated",
      value: stats.evaluatedSubmissions || 0,
      icon: MessageSquareText,
      note: "Feedback received"
    }
  ];

  return (
    <div className="dashboard-page student-dashboard-page">
      <section className="dashboard-hero student-hero">
        <div>
          <p className="dashboard-kicker">Student Workspace</p>
          <h1>Student Dashboard</h1>
          <p>
            View assignments, upload submissions, track plagiarism and AI
            content reports, and check teacher feedback.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/student/assignments">
              <Button>View Assignments</Button>
            </Link>

            <Link to="/student/submissions">
              <Button variant="secondary">My Submissions</Button>
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-card">
          <div className="hero-card-icon">
            <UploadCloud size={30} />
          </div>
          <h3>{stats.totalAssignments || 0}</h3>
          <p>Assignments Available</p>
          <span>Upload PDF, DOCX, or TXT files and view reports.</span>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="premium-stat-grid compact">
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
          subtitle="Latest assignments available for your department."
        />

        <AssignmentTable
          assignments={recentAssignments}
          role="STUDENT"
          onView={(assignment) =>
            navigate(`/student/assignments/${assignment._id}`)
          }
        />
      </div>

      <div className="section-block">
        <PageHeader
          title="Recent Submissions"
          subtitle="Your latest submitted assignments."
        />

        <SubmissionTable
          submissions={recentSubmissions}
          role="STUDENT"
          onView={(submission) =>
            navigate(`/student/submissions/${submission._id}`)
          }
          onViewReports={(submission) =>
            navigate(`/student/submissions/${submission._id}`)
          }
        />
      </div>
    </div>
  );
};

export default StudentDashboard;