import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/axios";
import { getPlagiarismReports } from "../../api/plagiarismApi";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import ReportTable from "../../components/tables/ReportTable";
import { formatDateTime } from "../../utils/formatDate";
import { getUserName } from "../../utils/helpers";

const PlagiarismReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getPlagiarismReports();
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
    return <Loader text="Loading plagiarism reports..." />;
  }

  return (
    <div>
      <PageHeader
        title="Plagiarism Reports"
        subtitle="Review similarity scores, matched sources, and risk levels."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <ReportTable
        reports={reports}
        type="plagiarism"
        onView={setSelectedReport}
      />

      <Modal
        open={Boolean(selectedReport)}
        title="Plagiarism Report Details"
        onClose={() => setSelectedReport(null)}
        size="lg"
      >
        {selectedReport && (
          <div className="report-details">
            <div className="report-score-card plagiarism">
              <h2>{selectedReport.similarityScore || 0}%</h2>
              <p>Similarity Score</p>
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

            <div className="panel-card">
              <h3>Matched Sources</h3>

              {!selectedReport.matchedSubmissions?.length ? (
                <p>No matched submissions found.</p>
              ) : (
                <div className="matched-list">
                  {selectedReport.matchedSubmissions.map((match, index) => (
                    <div className="matched-item" key={index}>
                      <p>
                        <strong>Student:</strong> {getUserName(match.student)}
                      </p>
                      <p>
                        <strong>Similarity:</strong> {match.similarity}%
                      </p>
                      <p>{match.matchedText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlagiarismReports;