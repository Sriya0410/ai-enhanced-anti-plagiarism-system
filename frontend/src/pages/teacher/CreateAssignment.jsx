import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "../../api/assignmentApi";
import { getErrorMessage } from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import AssignmentForm from "../../components/forms/AssignmentForm";

const CreateAssignment = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      setError("");

      await createAssignment(payload);

      navigate("/teacher/assignments");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Assignment"
        subtitle="Create assignments only for the subjects assigned to you by admin."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <AssignmentForm
        onSubmit={handleCreate}
        loading={saving}
        submitText="Create Assignment"
      />
    </div>
  );
};

export default CreateAssignment;