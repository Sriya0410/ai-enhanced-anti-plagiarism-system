import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../api/axios";
import { createOrUpdateEvaluation, getEvaluationBySubmission } from "../../api/evaluationApi";
import { getSubmissionById } from "../../api/submissionApi";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import EvaluationForm from "../../components/forms/EvaluationForm";

const EvaluateSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const submissionRes = await getSubmissionById(id);
      setSubmission(submissionRes?.data?.data?.submission || null);

      try {
        const evaluationRes = await getEvaluationBySubmission(id);
        setEvaluation(evaluationRes?.data?.data?.evaluation || null);
      } catch {
        setEvaluation(null);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");

      await createOrUpdateEvaluation(payload);

      navigate(`/teacher/submissions/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading evaluation..." />;
  }

  return (
    <div>
      <PageHeader
        title="Evaluate Submission"
        subtitle="Enter marks and feedback for the student."
      />

      {error && <div className="alert alert-error">{error}</div>}

      {submission && (
        <EvaluationForm
          submission={submission}
          existingEvaluation={evaluation}
          onSubmit={handleSave}
          loading={saving}
        />
      )}
    </div>
  );
};

export default EvaluateSubmission;