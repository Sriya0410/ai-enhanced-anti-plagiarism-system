import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFeedback } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import EvaluationTable from "../../components/tables/EvaluationTable";

const FeedbackPage = () => {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyFeedback();
      setEvaluations(response?.data?.data?.evaluations || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading) {
    return <Loader text="Loading feedback..." />;
  }

  return (
    <div>
      <PageHeader
        title="My Feedback"
        subtitle="View marks and feedback given by teachers."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <EvaluationTable
        evaluations={evaluations}
        onView={(evaluation) => {
          const submissionId =
            evaluation?.submission?._id || evaluation?.submission;

          if (submissionId) {
            navigate(`/student/submissions/${submissionId}`);
          }
        }}
      />
    </div>
  );
};

export default FeedbackPage;