import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAIContentReportBySubmission } from "../../api/aiDetectionApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";

const AIContentReport = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await getAIContentReportBySubmission(id);
      setReport(response?.data?.data?.report || null);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message.toLowerCase().includes("pending")) {
        setPending(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  if (loading) {
    return <Loader text="Loading AI content report..." />;
  }

  return (
    <div>
      <PageHeader
        title="AI Content Report"
        subtitle="AI-like writing score and summary."
      />

      {error && <div className="alert alert-error">{error}</div>}

      {pending && <div className="alert alert-warning">Report pending.</div>}

      {report && (
        <div className="report-details">
          <div className="report-score-card ai">
            <h2>{report.aiScore || 0}%</h2>
            <p>AI Content Score</p>
            <StatusBadge status={report.level} />
          </div>

          <div className="panel-card">
            <h3>Summary</h3>
            <p>{report.summary || "No summary available."}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentReport;