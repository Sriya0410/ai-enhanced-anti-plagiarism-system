import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getErrorMessage } from "../../api/axios";
import { getPlagiarismReportBySubmission } from "../../api/plagiarismApi";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { getUserName } from "../../utils/helpers";

const PlagiarismReport = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await getPlagiarismReportBySubmission(id);
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
    return <Loader text="Loading plagiarism report..." />;
  }

  return (
    <div>
      <PageHeader
        title="Plagiarism Report"
        subtitle="Similarity score and matched submissions."
      />

      {error && <div className="alert alert-error">{error}</div>}

      {pending && <div className="alert alert-warning">Report pending.</div>}

      {report && (
        <div className="report-details">
          <div className="report-score-card plagiarism">
            <h2>{report.similarityScore || 0}%</h2>
            <p>Similarity Score</p>
            <StatusBadge status={report.level} />
          </div>

          <div className="panel-card">
            <h3>Summary</h3>
            <p>{report.summary || "No summary available."}</p>
          </div>

          <div className="panel-card">
            <h3>Matched Submissions</h3>

            {!report.matchedSubmissions?.length ? (
              <p>No matched submissions found.</p>
            ) : (
              <div className="matched-list">
                {report.matchedSubmissions.map((match, index) => (
                  <div className="matched-item" key={index}>
                    <p><strong>Student:</strong> {getUserName(match.student)}</p>
                    <p><strong>Similarity:</strong> {match.similarity}%</p>
                    <p>{match.matchedText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlagiarismReport;