import { Edit, Trash2 } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

const DepartmentTable = ({ departments = [], onEdit, onDelete }) => {
  if (!departments.length) {
    return (
      <EmptyState
        title="No departments found"
        message="Departments will appear here after creation."
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
              <th>Code</th>
              <th>Description</th>
              <th>Status</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                <td>
                  <strong>{department.name}</strong>
                </td>

                <td>{department.code}</td>
                <td>{department.description || "N/A"}</td>

                <td>
                  <StatusBadge status={department.isActive} />
                </td>

                <td>
                  <div className="table-actions action-text-row">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(department)}
                      className="action-text-btn"
                    >
                      <Edit size={15} />
                      Edit
                    </Button>

                    <Button
                      variant="ghost-danger"
                      size="sm"
                      onClick={() => onDelete?.(department)}
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

export default DepartmentTable;