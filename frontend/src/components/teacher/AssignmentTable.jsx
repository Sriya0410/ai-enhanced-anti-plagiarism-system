import { Edit, Eye, Send, Trash2, XCircle, Users } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatDate";
import {
  getDepartmentName,
  getSubjectName,
  getUserName
} from "../../utils/helpers";

const AssignmentTable = ({
  assignments = [],
  role = "ADMIN",
  onView,
  onEdit,
  onDelete,
  onPublish,
  onClose,
  onViewSubmissions
}) => {
  if (!assignments.length) {
    return (
      <EmptyState
        title="No assignments found"
        message="Assignments will appear here once created."
      />
    );
  }

  return (
    <div className="table-card clean-table-card">
      <div className="table-responsive no-scroll-table">
        <table className="data-table compact-data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Department</th>
              <th>Teacher</th>
              <th>Due Date</th>
              <th>Marks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id}>
                <td className="wrap-cell strong-cell">
                  <strong>{assignment.title}</strong>
                </td>

                <td className="wrap-cell">{getSubjectName(assignment.subject)}</td>
                <td className="wrap-cell">
                  {getDepartmentName(assignment.department)}
                </td>
                <td className="wrap-cell">{getUserName(assignment.teacher)}</td>
                <td className="wrap-cell">{formatDate(assignment.dueDate)}</td>
                <td>{assignment.maxMarks}</td>

                <td>
                  <StatusBadge status={assignment.status} />
                </td>

                <td>
                  <div className="table-actions action-text-row">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(assignment)}
                      className="action-text-btn"
                    >
                      <Eye size={15} />
                      View
                    </Button>

                    {role === "TEACHER" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewSubmissions?.(assignment)}
                          className="action-text-btn"
                        >
                          <Users size={15} />
                          Submissions
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(assignment)}
                          className="action-text-btn"
                        >
                          <Edit size={15} />
                          Edit
                        </Button>

                        {assignment.status !== "PUBLISHED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPublish?.(assignment)}
                            className="action-text-btn"
                          >
                            <Send size={15} />
                            Publish
                          </Button>
                        )}

                        {assignment.status !== "CLOSED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onClose?.(assignment)}
                            className="action-text-btn"
                          >
                            <XCircle size={15} />
                            Close
                          </Button>
                        )}

                        <Button
                          variant="ghost-danger"
                          size="sm"
                          onClick={() => onDelete?.(assignment)}
                          className="action-text-btn"
                        >
                          <Trash2 size={15} />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentTable;