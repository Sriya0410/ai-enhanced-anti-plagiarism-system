import { useEffect, useState } from "react";
import { Eye, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyAssignments } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/formatDate";
import { getSubjectName, getUserName } from "../../utils/helpers";

const MyAssignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const response = await getMyAssignments();
      setAssignments(response?.data?.data?.assignments || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) {
    return <Loader text="Loading assignments..." />;
  }

  return (
    <div>
      <PageHeader
        title="My Assignments"
        subtitle="Assignments published for your department."
      />

      {error && <div className="alert alert-error">{error}</div>}

      {!assignments.length ? (
        <EmptyState
          title="No assignments found"
          message="No published assignments are available for your department yet."
        />
      ) : (
        <div className="assignment-grid">
          {assignments.map((assignment) => (
            <div className="assignment-card" key={assignment._id}>
              <div className="assignment-card-header">
                <div>
                  <h3>{assignment.title}</h3>
                  <p>{getSubjectName(assignment.subject)}</p>
                </div>

                <StatusBadge
                  status={assignment.isSubmitted ? assignment.submission?.status : "PENDING"}
                />
              </div>

              <p className="assignment-description">
                {assignment.description}
              </p>

              <div className="assignment-meta">
                <span>Teacher: {getUserName(assignment.teacher)}</span>
                <span>Due: {formatDate(assignment.dueDate)}</span>
                <span>Max Marks: {assignment.maxMarks}</span>
              </div>

              <div className="assignment-actions">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/student/assignments/${assignment._id}`)}
                >
                  <Eye size={16} />
                  View
                </Button>

                {!assignment.isSubmitted && (
                  <Button
                    onClick={() =>
                      navigate(`/student/assignments/${assignment._id}/submit`)
                    }
                  >
                    <Send size={16} />
                    Submit
                  </Button>
                )}

                {assignment.isSubmitted && assignment.submission?.submissionId && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(`/student/submissions/${assignment.submission.submissionId}`)
                    }
                  >
                    View Submission
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssignments;