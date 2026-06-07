import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentAssignmentById } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import { submitAssignment } from "../../api/submissionApi";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import SubmissionUploadForm from "../../components/forms/SubmissionUploadForm";
import { getSubjectName } from "../../utils/helpers";

const SubmitAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAssignment = async () => {
    try {
      setLoading(true);

      const response = await getStudentAssignmentById(id);

      setAssignment(response?.data?.data?.assignment || null);
      setSubmission(response?.data?.data?.submission || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError("");

      const response = await submitAssignment(formData);
      const createdSubmission = response?.data?.data?.submission;

      navigate(`/student/submissions/${createdSubmission._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading assignment..." />;
  }

  if (submission) {
    return (
      <div>
        <PageHeader
          title="Already Submitted"
          subtitle="You have already submitted this assignment."
        />

        <div className="alert alert-warning">
          You cannot submit the same assignment again.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Submit Assignment"
        subtitle={
          assignment
            ? `${assignment.title} - ${getSubjectName(assignment.subject)}`
            : "Upload your assignment file."
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      {assignment && (
        <SubmissionUploadForm
          assignmentId={assignment._id}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      )}
    </div>
  );
};

export default SubmitAssignment;