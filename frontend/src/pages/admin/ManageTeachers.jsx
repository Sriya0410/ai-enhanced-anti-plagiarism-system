import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  createUserByAdmin,
  deleteUserByAdmin,
  getAllTeachers,
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

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getAllTeachers();
      setTeachers(response?.data?.data?.teachers || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreate = () => {
    setSelectedTeacher(null);
    setModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);

      if (selectedTeacher) {
        await updateUserByAdmin(selectedTeacher._id, payload);
      } else {
        await createUserByAdmin({
          ...payload,
          role: ROLES.TEACHER
        });
      }

      setModalOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (teacher) => {
    try {
      await toggleUserStatus(teacher._id);
      fetchTeachers();
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
      fetchTeachers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading teachers..." />;
  }

  return (
    <div>
      <PageHeader
        title="Manage Teachers"
        subtitle="Create teachers and assign department/profile details."
        actions={
          <Button onClick={handleCreate}>
            <Plus size={18} />
            Add Teacher
          </Button>
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      <UserTable
        users={teachers}
        type="teachers"
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onToggleStatus={handleToggle}
      />

      <Modal
        open={modalOpen}
        title={selectedTeacher ? "Edit Teacher" : "Add Teacher"}
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <UserForm
          initialData={selectedTeacher}
          defaultRole={ROLES.TEACHER}
          onSubmit={handleSave}
          loading={saving}
          submitText={selectedTeacher ? "Update Teacher" : "Create Teacher"}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageTeachers;