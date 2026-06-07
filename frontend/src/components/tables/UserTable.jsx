import { Edit, Eye, Trash2 } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { getDepartmentName } from "../../utils/helpers";

const UserTable = ({
  users = [],
  type = "users",
  onEdit,
  onDelete,
  onToggleStatus,
  onView
}) => {
  if (!users.length) {
    return (
      <EmptyState
        title={`No ${type} found`}
        message={`${type} will appear here after creation.`}
      />
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>

              {type === "students" && (
                <>
                  <th>Register No</th>
                  <th>Year</th>
                  <th>Section</th>
                </>
              )}

              {type === "teachers" && (
                <>
                  <th>Employee ID</th>
                  <th>Designation</th>
                </>
              )}

              <th>Status</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <strong>{user.name}</strong>
                </td>

                <td>{user.email}</td>

                <td>{getDepartmentName(user.department)}</td>

                {type === "students" && (
                  <>
                    <td>{user.rollNumber || "N/A"}</td>
                    <td>{user.year || "N/A"}</td>
                    <td>{user.section || "N/A"}</td>
                  </>
                )}

                {type === "teachers" && (
                  <>
                    <td>{user.employeeId || "N/A"}</td>
                    <td>{user.designation || "N/A"}</td>
                  </>
                )}

                <td>
                  <StatusBadge status={user.isActive} />
                </td>

                <td>
                  <div className="table-actions action-text-row">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(user)}
                        className="action-text-btn"
                      >
                        <Eye size={15} />
                        View
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(user)}
                      className="action-text-btn"
                    >
                      <Edit size={15} />
                      Edit
                    </Button>

                    <Button
                      variant={user.isActive ? "ghost-danger" : "secondary"}
                      size="sm"
                      onClick={() => onToggleStatus?.(user)}
                      className="action-text-btn"
                    >
                      {user.isActive ? "Inactive" : "Active"}
                    </Button>

                    <Button
                      variant="ghost-danger"
                      size="sm"
                      onClick={() => onDelete?.(user)}
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

export default UserTable;