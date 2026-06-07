import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMySubmissionById } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import { getSubjectName, getUserName } from "../../utils/helpers";

const SubmissionDetails = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMySubmissionById(id);
      setData(response?.data?.data || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  if (loading) {
    return <Loader text="Loading submission details..." />;
  }

  const submission = data?.submission;
  const plagiarismReport = data?.plagiarismReport;
  const aiContentReport = data?.aiContentReport;
  const evaluation = data?.evaluation;

  return (
    <div className="submission-details-page">
      <PageHeader
        title="Submission Details"
        subtitle="View your automatic reports and teacher feedback."
      />

      {error && <div className="alert alert-error">{error}</div>}

      {!submission ? (
        <div className="alert alert-error">Submission details not found.</div>
      ) : (
        <>
          <div className="details-card">
            <h2>{submission.assignment?.title || "Assignment Details"}</h2>

            <div className="details-grid">
              <p>
                <strong>Subject:</strong> {getSubjectName(submission.subject)}
              </p>

              <p>
                <strong>Teacher:</strong> {getUserName(submission.teacher)}
              </p>

              <p>
                <strong>File:</strong>{" "}
                {submission.originalFileName || submission.fileName || "N/A"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge status={submission.status} />
              </p>

              <p>
                <strong>Submitted:</strong>{" "}
                {formatDateTime(submission.submittedAt)}
              </p>

              <p>
                <strong>Late:</strong> {submission.isLate ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="content-grid two">
            <div className="report-score-card plagiarism">
              <h2>{submission.plagiarismScore || 0}%</h2>
              <p>Plagiarism Score</p>

              <StatusBadge status={plagiarismReport?.level || "PENDING"} />

              <span>{plagiarismReport?.summary || "Report pending"}</span>
            </div>

            <div className="report-score-card ai">
              <h2>{submission.aiScore || 0}%</h2>
              <p>AI Content Score</p>

              <StatusBadge status={aiContentReport?.level || "PENDING"} />

              <span>{aiContentReport?.summary || "Report pending"}</span>
            </div>
          </div>

          <div className="panel-card">
            <h3>Plagiarism Matched Sources</h3>

            {!plagiarismReport?.matchedSubmissions?.length ? (
              <p>No matched sources found.</p>
            ) : (
              <div className="matched-list">
                {plagiarismReport.matchedSubmissions.map((match, index) => (
                  <div className="matched-item" key={index}>
                    <p>
                      <strong>Student:</strong> {getUserName(match.student)}
                    </p>

                    <p>
                      <strong>Similarity:</strong> {match.similarity}%
                    </p>

                    <p>{match.matchedText || "Matched text not available."}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel-card">
            <h3>Feedback</h3>

            {evaluation ? (
              <div className="feedback-box">
                <div className="feedback-marks">
                  Marks: {evaluation.marks}/
                  {submission.assignment?.maxMarks || 100}
                </div>

                <p>
                  <strong>Feedback:</strong>{" "}
                  {evaluation.feedback || "No feedback added."}
                </p>
              </div>
            ) : (
              <p>Feedback pending.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SubmissionDetails;