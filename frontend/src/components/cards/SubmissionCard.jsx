import { Eye, ShieldCheck } from "lucide-react";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import { getSubjectName } from "../../utils/helpers";

const SubmissionCard = ({ submission, onView, onViewReports }) => {
  if (!submission) {
    return null;
  }

  const plagiarismLevel =
    submission.plagiarismScore >= 70
      ? "HIGH"
      : submission.plagiarismScore >= 35
        ? "MEDIUM"
        : "LOW";

  const aiLevel =
    submission.aiScore >= 70
      ? "HIGH"
      : submission.aiScore >= 35
        ? "MEDIUM"
        : "LOW";

  return (
    <div className="panel-card">
      <h3>{submission.assignment?.title || "Assignment"}</h3>

      <div className="details-grid">
        <p>
          <strong>Subject:</strong> {getSubjectName(submission.subject)}
        </p>
        <p>
          <strong>File:</strong>{" "}
          {submission.originalFileName || submission.fileName || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> <StatusBadge status={submission.status} />
        </p>
        <p>
          <strong>Submitted:</strong> {formatDateTime(submission.submittedAt)}
        </p>
        <p>
          <strong>Plagiarism:</strong>{" "}
          <StatusBadge status={plagiarismLevel}>
            {submission.plagiarismScore || 0}%
          </StatusBadge>
        </p>
        <p>
          <strong>AI Content:</strong>{" "}
          <StatusBadge status={aiLevel}>{submission.aiScore || 0}%</StatusBadge>
        </p>
      </div>

      <div className="assignment-actions">
        <Button variant="secondary" onClick={() => onView?.(submission)}>
          <Eye size={16} />
          View
        </Button>

        <Button variant="secondary" onClick={() => onViewReports?.(submission)}>
          <ShieldCheck size={16} />
          Reports
        </Button>
      </div>
    </div>
  );
};

export default SubmissionCard;