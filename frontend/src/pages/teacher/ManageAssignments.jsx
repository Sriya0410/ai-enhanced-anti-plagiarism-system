import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  closeAssignment,
  deleteAssignment,
  getAssignments,
  publishAssignment
} from "../../api/assignmentApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import AssignmentTable from "../../components/tables/AssignmentTable";

const ManageAssignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAssignments();
      setAssignments(response?.data?.data?.assignments || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (assignment) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${assignment.title}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteAssignment(assignment._id);
      await fetchAssignments();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async (assignment) => {
    try {
      setActionLoading(true);
      setError("");

      await publishAssignment(assignment._id);
      await fetchAssignments();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async (assignment) => {
    try {
      setActionLoading(true);
      setError("");

      await closeAssignment(assignment._id);
      await fetchAssignments();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading assignments..." />;
  }

  return (
    <div>
      <PageHeader
        title="My Assignments"
        subtitle="Manage assignments created by you."
      />

      {error && <div className="alert alert-error">{error}</div>}
      {actionLoading && (
        <div className="alert alert-info">Updating assignment...</div>
      )}

      <AssignmentTable
        assignments={assignments}
        role="TEACHER"
        onView={(assignment) =>
          navigate(`/teacher/assignments/${assignment._id}/submissions`)
        }
        onViewSubmissions={(assignment) =>
          navigate(`/teacher/assignments/${assignment._id}/submissions`)
        }
        onEdit={(assignment) =>
          navigate(`/teacher/assignments/${assignment._id}/edit`)
        }
        onDelete={handleDelete}
        onPublish={handlePublish}
        onClose={handleClose}
      />
    </div>
  );
};

export default ManageAssignments;