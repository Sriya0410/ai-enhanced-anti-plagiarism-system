import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarClock,
  FileText,
  GraduationCap,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserCircle
} from "lucide-react";
import { getErrorMessage } from "../../api/axios";
import { getSubmissionById } from "../../api/submissionApi";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import {
  getDepartmentName,
  getSubjectName,
  getUserName
} from "../../utils/helpers";

const SubmissionDetails = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSubmissionById(id);
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
    <div className="teacher-submission-details-page">
      <PageHeader
        title="Submission Details"
        subtitle="Review submitted file, automatic reports, extracted text, and evaluation details."
        actions={
          submission && (
            <Link to={`/teacher/submissions/${submission._id}/evaluate`}>
              <Button>
                <Award size={18} />
                Evaluate
              </Button>
            </Link>
          )
        }
      />

      {error && <div className="alert alert-error">{error}</div>}

      {!submission ? (
        <div className="alert alert-error">Submission details not found.</div>
      ) : (
        <>
          <section className="teacher-submission-hero">
            <div>
              <p className="teacher-submission-kicker">
                <Sparkles size={15} />
                Student Submission Review
              </p>

              <h1>{submission.assignment?.title || "Assignment Submission"}</h1>

              <p>
                Review the uploaded file, plagiarism score, AI-content score,
                extracted text, and teacher evaluation status.
              </p>

              <div className="teacher-submission-tags">
                <span>
                  <UserCircle size={15} />
                  {getUserName(submission.student)}
                </span>

                <span>
                  <BookOpen size={15} />
                  {getSubjectName(submission.subject)}
                </span>

                <span>
                  <ShieldCheck size={15} />
                  {submission.status || "SUBMITTED"}
                </span>
              </div>
            </div>

            <div className="teacher-submission-hero-card">
              <div className="teacher-submission-hero-icon">
                <FileText size={27} />
              </div>

              <h3>{submission.originalFileName || submission.fileName || "File"}</h3>
              <p>Submitted on {formatDateTime(submission.submittedAt)}</p>
            </div>
          </section>

          <section className="teacher-details-card">
            <div className="teacher-details-title">
              <div>
                <p>Submission Information</p>
                <h3>File & Student Details</h3>
              </div>
            </div>

            <div className="teacher-details-grid">
              <div>
                <UserCircle size={18} />
                <p>Student</p>
                <h4>{getUserName(submission.student)}</h4>
              </div>

              <div>
                <GraduationCap size={18} />
                <p>Department</p>
                <h4>{getDepartmentName(submission.department)}</h4>
              </div>

              <div>
                <BookOpen size={18} />
                <p>Subject</p>
                <h4>{getSubjectName(submission.subject)}</h4>
              </div>

              <div>
                <FileText size={18} />
                <p>File</p>
                <h4>{submission.originalFileName || submission.fileName || "N/A"}</h4>
              </div>

              <div>
                <ShieldCheck size={18} />
                <p>Status</p>
                <h4>
                  <StatusBadge status={submission.status} />
                </h4>
              </div>

              <div>
                <CalendarClock size={18} />
                <p>Submitted</p>
                <h4>{formatDateTime(submission.submittedAt)}</h4>
              </div>
            </div>
          </section>

          <div className="teacher-report-score-grid">
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

          <section className="teacher-panel-card">
            <h3>Extracted Text Preview</h3>

            <div className="teacher-extracted-text">
              {submission.extractedText || "No extracted text available."}
            </div>
          </section>

          <section className="teacher-panel-card">
            <h3>Evaluation</h3>

            {evaluation ? (
              <div className="teacher-feedback-box">
                <div className="teacher-feedback-marks">
                  Marks: {evaluation.marks}/{submission.assignment?.maxMarks || 100}
                </div>

                <p>
                  <MessageSquareText size={17} />
                  <span>{evaluation.feedback || "No feedback added."}</span>
                </p>
              </div>
            ) : (
              <div className="teacher-feedback-empty">
                Feedback pending. Click Evaluate to add marks and feedback.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default SubmissionDetails;