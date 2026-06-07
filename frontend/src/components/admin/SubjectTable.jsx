import { Edit, Trash2 } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { getDepartmentName, getUserName } from "../../utils/helpers";

const SubjectTable = ({ subjects = [], onEdit, onDelete }) => {
  if (!subjects.length) {
    return (
      <EmptyState
        title="No subjects found"
        message="Subjects will appear here after creation."
      />
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>Department</th>
              <th>Teacher</th>
              <th>Semester</th>
              <th>Status</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td>
                  <strong>{subject.name}</strong>
                </td>

                <td>{subject.code}</td>
                <td>{getDepartmentName(subject.department)}</td>
                <td>{getUserName(subject.teacher)}</td>
                <td>{subject.semester}</td>

                <td>
                  <StatusBadge status={subject.isActive} />
                </td>

                <td>
                  <div className="table-actions action-text-row">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(subject)}
                      className="action-text-btn"
                    >
                      <Edit size={15} />
                      Edit
                    </Button>

                    <Button
                      variant="ghost-danger"
                      size="sm"
                      onClick={() => onDelete?.(subject)}
                      className="action-text-btn"
                    >
                      <Trash2 size={15} />
                      Delete
                    </Button>
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

export default SubjectTable;