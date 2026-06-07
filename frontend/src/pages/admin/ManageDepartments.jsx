import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment
} from "../../api/departmentApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import DepartmentForm from "../../components/forms/DepartmentForm";

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments();
      setDepartments(response?.data?.data?.departments || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = () => {
    setSelectedDepartment(null);
    setModalOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);

      if (selectedDepartment) {
        await updateDepartment(selectedDepartment._id, payload);
      } else {
        await createDepartment(payload);
      }

      setModalOpen(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      await deleteDepartment(deleteTarget._id);
      setDeleteTarget(null);
      fetchDepartments();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading departments..." />;
  }

  return (
    <div>
      <PageHeader
        title="Manage Departments"
        subtitle="Add and maintain academic departments used during student registration."
        actions={
          <Button onClick={handleCreate}>
            <Plus size={18} />
            Add Department
          </Button>
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      {!departments.length ? (
        <EmptyState title="No departments found" />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                      <div className="table-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(department)}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          variant="ghost-danger"
                          size="sm"
                          onClick={() => setDeleteTarget(department)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={selectedDepartment ? "Edit Department" : "Add Department"}
        onClose={() => setModalOpen(false)}
      >
        <DepartmentForm
          initialData={selectedDepartment}
          onSubmit={handleSave}
          loading={saving}
          submitText={selectedDepartment ? "Update Department" : "Create Department"}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Department"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageDepartments;