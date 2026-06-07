import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject
} from "../../api/subjectApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import SubjectForm from "../../components/forms/SubjectForm";
import { getDepartmentName, getUserName } from "../../utils/helpers";

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSubjects();
      setSubjects(response?.data?.data?.subjects || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = () => {
    setSelectedSubject(null);
    setModalOpen(true);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);

      if (selectedSubject) {
        await updateSubject(selectedSubject._id, payload);
      } else {
        await createSubject(payload);
      }

      setModalOpen(false);
      setSelectedSubject(null);
      fetchSubjects();
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
      await deleteSubject(deleteTarget._id);
      setDeleteTarget(null);
      fetchSubjects();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading subjects..." />;
  }

  return (
    <div>
      <PageHeader
        title="Manage Subjects"
        subtitle="Create subjects, map departments, and optionally assign teachers."
        actions={
          <Button onClick={handleCreate}>
            <Plus size={18} />
            Add Subject
          </Button>
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      {!subjects.length ? (
        <EmptyState title="No subjects found" />
      ) : (
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
                  <th>Actions</th>
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
      onClick={() => handleEdit(subject)}
      className="action-text-btn"
    >
      <Edit size={15} />
      Edit
    </Button>

    <Button
      variant="ghost-danger"
      size="sm"
      onClick={() => setDeleteTarget(subject)}
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
      )}

      <Modal
        open={modalOpen}
        title={selectedSubject ? "Edit Subject" : "Add Subject"}
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <SubjectForm
          initialData={selectedSubject}
          onSubmit={handleSave}
          loading={saving}
          submitText={selectedSubject ? "Update Subject" : "Create Subject"}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Subject"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageSubjects;