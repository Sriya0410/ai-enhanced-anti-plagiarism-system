import { Eye } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import { getUserName } from "../../utils/helpers";

const EvaluationTable = ({ evaluations = [], onView }) => {
  if (!evaluations.length) {
    return (
      <EmptyState
        title="No feedback found"
        message="Teacher feedback will appear here after evaluation."
      />
    );
  }

  const getFeedbackPreview = (text = "") => {
    if (!text.trim()) {
      return "No feedback added.";
    }

    return text.length > 180 ? `${text.slice(0, 180)}...` : text;
  };

  return (
    <div className="feedback-list">
      {evaluations.map((evaluation) => (
        <div className="feedback-card" key={evaluation._id}>
          <div className="feedback-card-main">
            <div className="feedback-assignment">
              <p>Assignment</p>
              <h3>{evaluation.assignment?.title || "N/A"}</h3>
            </div>

            <div className="feedback-meta-grid">
              <div>
                <span>Teacher</span>
                <strong>{getUserName(evaluation.teacher)}</strong>
              </div>

              <div>
                <span>Marks</span>
                <strong>
                  {evaluation.marks}/{evaluation.assignment?.maxMarks || 100}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <StatusBadge status={evaluation.status || "EVALUATED"} />
              </div>

              <div>
                <span>Evaluated</span>
                <strong>{formatDateTime(evaluation.createdAt)}</strong>
              </div>
            </div>

            <div className="feedback-preview-box">
              <span>Feedback Preview</span>
              <p>{getFeedbackPreview(evaluation.feedback)}</p>
            </div>
          </div>

          <div className="feedback-card-action">
            <Button
              variant="ghost"
              size="sm"
              className="action-text-btn"
              onClick={() => onView?.(evaluation)}
            >
              <Eye size={15} />
              View Full
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluationTable;