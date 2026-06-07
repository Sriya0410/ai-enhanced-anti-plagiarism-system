import SubmissionUploadForm from "../forms/SubmissionUploadForm";

const SubmissionForm = ({
  assignmentId,
  onSubmit,
  loading = false
}) => {
  return (
    <SubmissionUploadForm
      assignmentId={assignmentId}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};

export default SubmissionForm;