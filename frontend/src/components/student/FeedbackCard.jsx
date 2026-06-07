import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import { getUserName } from "../../utils/helpers";

const FeedbackCard = ({ evaluation }) => {
  if (!evaluation) {
    return (
      <div className="panel-card">
        <h3>Feedback</h3>
        <p>Feedback pending.</p>
      </div>
    );
  }

  return (
    <div className="panel-card">
      <h3>{evaluation.assignment?.title || "Assignment Feedback"}</h3>

      <div className="details-grid">
        <p>
          <strong>Teacher:</strong> {getUserName(evaluation.teacher)}
        </p>

        <p>
          <strong>Marks:</strong> {evaluation.marks}/
          {evaluation.assignment?.maxMarks || 100}
        </p>

        <p>
          <strong>Status:</strong> <StatusBadge status="EVALUATED" />
        </p>

        <p>
          <strong>Evaluated:</strong> {formatDateTime(evaluation.createdAt)}
        </p>
      </div>

      <div className="panel-card inner-card">
        <h4>Teacher Feedback</h4>
        <p>{evaluation.feedback || "No feedback available."}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;