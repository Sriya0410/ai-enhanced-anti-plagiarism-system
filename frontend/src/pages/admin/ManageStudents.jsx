import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  createUserByAdmin,
  deleteUserByAdmin,
  getAllStudents,
  toggleUserStatus,
  updateUserByAdmin
} from "../../api/adminApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import UserForm from "../../components/forms/UserForm";
import UserTable from "../../components/tables/UserTable";
import { ROLES } from "../../utils/constants";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response?.data?.data?.students || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreate = () => {
    setSelectedStudent(null);
    setModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);

      if (selectedStudent) {
        await updateUserByAdmin(selectedStudent._id, payload);
      } else {
        await createUserByAdmin({
          ...payload,
          role: ROLES.STUDENT
        });
      }

      setModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (student) => {
    try {
      await toggleUserStatus(student._id);
      fetchStudents();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      await deleteUserByAdmin(deleteTarget._id);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading students..." />;
  }

  return (
    <div>
      <PageHeader
        title="Manage Students"
        subtitle="Create, update, activate, deactivate, and delete student accounts."
        actions={
          <Button onClick={handleCreate}>
            <Plus size={18} />
            Add Student
          </Button>
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      <UserTable
        users={students}
        type="students"
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onToggleStatus={handleToggle}
      />

      <Modal
        open={modalOpen}
        title={selectedStudent ? "Edit Student" : "Add Student"}
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <UserForm
          initialData={selectedStudent}
          defaultRole={ROLES.STUDENT}
          onSubmit={handleSave}
          loading={saving}
          submitText={selectedStudent ? "Update Student" : "Create Student"}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageStudents;