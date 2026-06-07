import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../api/axios";
import { getSubmissions } from "../../api/submissionApi";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import SubmissionTable from "../../components/tables/SubmissionTable";

const AllSubmissions = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getSubmissions();
      setSubmissions(response?.data?.data?.submissions || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (loading) {
    return <Loader text="Loading submissions..." />;
  }

  return (
    <div>
      <PageHeader
        title="All Submissions"
        subtitle="View all student submissions with plagiarism and AI scores."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <SubmissionTable
        submissions={submissions}
        role="ADMIN"
        onView={(submission) => navigate(`/admin/submissions?id=${submission._id}`)}
        onViewReports={(submission) =>
          navigate(`/admin/plagiarism-reports?submission=${submission._id}`)
        }
      />
    </div>
  );
};

export default AllSubmissions;