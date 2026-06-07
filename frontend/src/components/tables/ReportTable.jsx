import { Eye } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";

const ReportTable = ({ reports = [], type = "plagiarism", onView }) => {
  if (!reports.length) {
    return (
      <EmptyState
        title="No reports found"
        message="Reports will appear here after assignment submission."
      />
    );
  }

  const isPlagiarism = type === "plagiarism";

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>File</th>
              <th>{isPlagiarism ? "Similarity Score" : "AI Score"}</th>
              <th>Risk Level</th>
              <th>Summary</th>
              <th>Generated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => {
              const score = isPlagiarism
                ? report.similarityScore
                : report.aiScore;

              return (
                <tr key={report._id}>
                  <td className="wrap-cell strong-cell">
                    <strong>{report.assignment?.title || "N/A"}</strong>
                  </td>

                  <td className="file-name-cell">
                    {report.submission?.originalFileName ||
                      report.submission?.fileName ||
                      "N/A"}
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        score >= 70 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW"
                      }
                    >
                      {score ?? 0}%
                    </StatusBadge>
                  </td>

                  <td>
                    <StatusBadge status={report.level || "LOW"} />
                  </td>

                  <td className="wrap-cell">
                    {report.summary || "Report generated successfully."}
                  </td>

                  <td>{formatDateTime(report.createdAt)}</td>

                  <td>
                    <div className="table-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="action-text-btn"
                        onClick={() => onView?.(report)}
                      >
                        <Eye size={15} />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;