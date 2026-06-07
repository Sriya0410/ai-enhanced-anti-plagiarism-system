import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../api/axios";
import {
  getSubmissions,
  getSubmissionsByAssignment
} from "../../api/submissionApi";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import SubmissionTable from "../../components/tables/SubmissionTable";

const ViewSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = assignmentId
        ? await getSubmissionsByAssignment(assignmentId)
        : await getSubmissions();

      setSubmissions(response?.data?.data?.submissions || []);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  if (loading) {
    return <Loader text="Loading submissions..." />;
  }

  return (
    <div>
      <PageHeader
        title={assignmentId ? "Assignment Submissions" : "All Submissions"}
        subtitle={
          assignmentId
            ? "View submitted files for this assignment, automatic reports, and evaluation status."
            : "View all student submissions received for your assignments."
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      <SubmissionTable
        submissions={submissions}
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
  );
};

export default ViewSubmissions;