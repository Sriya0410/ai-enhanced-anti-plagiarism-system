import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import { getUserName } from "../../utils/helpers";

const ReportCard = ({ report, type = "plagiarism" }) => {
  if (!report) {
    return null;
  }

  const isPlagiarism = type === "plagiarism";
  const score = isPlagiarism ? report.similarityScore : report.aiScore;

  return (
    <div className={`report-score-card ${isPlagiarism ? "plagiarism" : "ai"}`}>
      <h2>{score || 0}%</h2>
      <p>{isPlagiarism ? "Similarity Score" : "AI Content Score"}</p>

      <StatusBadge status={report.level || "PENDING"} />

      <span>{report.summary || "Report pending."}</span>

      <div className="report-card-meta">
        <span>Student: {getUserName(report.student)}</span>
        <span>Generated: {formatDateTime(report.createdAt)}</span>
      </div>
    </div>
  );
};

export default ReportCard;