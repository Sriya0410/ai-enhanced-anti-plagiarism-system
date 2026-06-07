import { useEffect, useState } from "react";
import { getAIContentReports } from "../../api/aiDetectionApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import ReportTable from "../../components/tables/ReportTable";
import { formatDateTime } from "../../utils/formatDate";
import { getUserName } from "../../utils/helpers";

const AIContentReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAIContentReports();
      setReports(response?.data?.data?.reports || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <Loader text="Loading AI reports..." />;
  }

  return (
    <div>
      <PageHeader
        title="AI Content Reports"
        subtitle="Review AI-like writing scores and risk levels."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <ReportTable
        reports={reports}
        type="ai"
        onView={setSelectedReport}
      />

      <Modal
        open={Boolean(selectedReport)}
        title="AI Content Report Details"
        onClose={() => setSelectedReport(null)}
        size="lg"
      >
        {selectedReport && (
          <div className="report-details">
            <div className="report-score-card ai">
              <h2>{selectedReport.aiScore || 0}%</h2>
              <p>AI Content Score</p>
              <StatusBadge status={selectedReport.level} />
            </div>

            <div className="details-grid">
              <p>
                <strong>Assignment:</strong>{" "}
                {selectedReport.assignment?.title || "N/A"}
              </p>
              <p>
                <strong>Student:</strong> {getUserName(selectedReport.student)}
              </p>
              <p>
                <strong>Generated:</strong>{" "}
                {formatDateTime(selectedReport.createdAt)}
              </p>
            </div>

            <div className="panel-card">
              <h3>Summary</h3>
              <p>{selectedReport.summary || "No summary available."}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIContentReports;