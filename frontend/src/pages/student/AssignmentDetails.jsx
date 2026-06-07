import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStudentAssignmentById } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/formatDate";
import { getDepartmentName, getSubjectName, getUserName } from "../../utils/helpers";

const AssignmentDetails = () => {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignment = async () => {
    try {
      setLoading(true);

      const response = await getStudentAssignmentById(id);

      setAssignment(response?.data?.data?.assignment || null);
      setSubmission(response?.data?.data?.submission || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  if (loading) {
    return <Loader text="Loading assignment details..." />;
  }

  return (
    <div>
      <PageHeader
        title="Assignment Details"
        subtitle="Read assignment information and submit your work."
        actions={
          assignment &&
          !submission && (
            <Link to={`/student/assignments/${assignment._id}/submit`}>
              <Button>Submit Assignment</Button>
            </Link>
          )
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      {assignment && (
        <div className="details-card">
          <div className="details-title-row">
            <div>
              <h2>{assignment.title}</h2>
              <p>{assignment.description}</p>
            </div>

            <StatusBadge status={assignment.status} />
          </div>

          <div className="details-grid">
            <p>
              <strong>Subject:</strong> {getSubjectName(assignment.subject)}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {getDepartmentName(assignment.department)}
            </p>
            <p>
              <strong>Teacher:</strong> {getUserName(assignment.teacher)}
            </p>
            <p>
              <strong>Due Date:</strong> {formatDate(assignment.dueDate)}
            </p>
            <p>
              <strong>Maximum Marks:</strong> {assignment.maxMarks}
            </p>
          </div>
        </div>
      )}

      {submission && (
        <div className="panel-card">
          <h3>Your Submission</h3>
          <p>
            <strong>File:</strong>{" "}
            {submission.originalFileName || submission.fileName}
          </p>
          <p>
            <strong>Status:</strong> <StatusBadge status={submission.status} />
          </p>
          <p>
            <strong>Plagiarism:</strong> {submission.plagiarismScore || 0}%
          </p>
          <p>
            <strong>AI Content:</strong> {submission.aiScore || 0}%
          </p>

          <Link to={`/student/submissions/${submission._id}`}>
            <Button variant="secondary">View Submission Details</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetails;