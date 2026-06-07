import { Eye, Send } from "lucide-react";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatDate";
import { getSubjectName, getUserName } from "../../utils/helpers";

const AssignmentCard = ({
  assignment,
  onView,
  onSubmit,
  showSubmit = false
}) => {
  if (!assignment) {
    return null;
  }

  return (
    <div className="assignment-card">
      <div className="assignment-card-header">
        <div>
          <h3>{assignment.title}</h3>
          <p>{getSubjectName(assignment.subject)}</p>
        </div>

        <StatusBadge
          status={
            assignment.isSubmitted
              ? assignment.submission?.status || "SUBMITTED"
              : assignment.status || "PENDING"
          }
        />
      </div>

      <p className="assignment-description">
        {assignment.description || "No description available."}
      </p>

      <div className="assignment-meta">
        <span>Teacher: {getUserName(assignment.teacher)}</span>
        <span>Due: {formatDate(assignment.dueDate)}</span>
        <span>Max Marks: {assignment.maxMarks || 100}</span>
      </div>

      <div className="assignment-actions">
        <Button variant="secondary" onClick={() => onView?.(assignment)}>
          <Eye size={16} />
          View
        </Button>

        {showSubmit && !assignment.isSubmitted && (
          <Button onClick={() => onSubmit?.(assignment)}>
            <Send size={16} />
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;