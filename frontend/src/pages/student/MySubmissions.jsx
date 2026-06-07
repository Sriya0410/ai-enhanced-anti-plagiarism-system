import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubmissions } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import SubmissionTable from "../../components/tables/SubmissionTable";

const MySubmissions = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      const response = await getMySubmissions();
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
        title="My Submissions"
        subtitle="Track your submitted assignments, reports, and feedback."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <SubmissionTable
        submissions={submissions}
        role="STUDENT"
        onView={(submission) => navigate(`/student/submissions/${submission._id}`)}
        onViewReports={(submission) =>
          navigate(`/student/submissions/${submission._id}`)
        }
      />
    </div>
  );
};

export default MySubmissions;