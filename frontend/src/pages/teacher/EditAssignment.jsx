import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignmentById, updateAssignment } from "../../api/assignmentApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import AssignmentForm from "../../components/forms/AssignmentForm";

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentById(id);
      setAssignment(response?.data?.data?.assignment || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      setSaving(true);
      setError("");

      await updateAssignment(id, payload);

      navigate("/teacher/assignments");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading assignment..." />;
  }

  return (
    <div>
      <PageHeader
        title="Edit Assignment"
        subtitle="Update assignment details using only your assigned subjects."
      />

      {error && <div className="alert alert-error">{error}</div>}

      {assignment && (
        <AssignmentForm
          initialData={assignment}
          onSubmit={handleUpdate}
          loading={saving}
          submitText="Update Assignment"
        />
      )}
    </div>
  );
};

export default EditAssignment;