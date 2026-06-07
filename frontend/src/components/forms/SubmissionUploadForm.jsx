import { useState } from "react";
import { validateSubmissionFile } from "../../utils/fileValidator";
import Button from "../common/Button";

const SubmissionUploadForm = ({ assignmentId, onSubmit, loading = false }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setFile(selectedFile || null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateSubmissionFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);

    onSubmit(formData);
  };

  return (
    <form className="form-card upload-form" onSubmit={handleSubmit}>
      <div className="upload-box">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
        />

        <div>
          <h3>Upload Assignment File</h3>
          <p>Accepted formats: PDF, DOCX, TXT. Max size: 10 MB.</p>
        </div>
      </div>

      {file && (
        <div className="selected-file">
          <strong>Selected:</strong> {file.name}
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      <Button type="submit" loading={loading}>
        Submit Assignment
      </Button>
    </form>
  );
};

export default SubmissionUploadForm;