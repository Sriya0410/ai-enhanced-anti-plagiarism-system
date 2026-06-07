import {
  Eye,
  FileCheck,
  MessageSquareText,
  ShieldCheck
} from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatDate";
import {
  getDepartmentName,
  getSubjectName,
  getUserName
} from "../../utils/helpers";

const SubmissionTable = ({
  submissions = [],
  role = "ADMIN",
  onView,
  onEvaluate,
  onViewReports
}) => {
  if (!submissions.length) {
    return (
      <EmptyState
        title="No submissions found"
        message="Submitted assignments will appear here."
      />
    );
  }

  return (
    <div className="table-card clean-table-card">
      <div className="table-responsive no-scroll-table">
        <table className="data-table compact-data-table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Student</th>
              <th>Department</th>
              <th>Subject</th>
              <th>File</th>
              <th>Plagiarism</th>
              <th>AI Score</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td className="wrap-cell strong-cell">
                  <strong>{submission.assignment?.title || "N/A"}</strong>
                </td>

                <td className="wrap-cell">{getUserName(submission.student)}</td>
                <td className="wrap-cell">
                  {getDepartmentName(submission.department)}
                </td>
                <td className="wrap-cell">{getSubjectName(submission.subject)}</td>

                <td className="file-name-cell">
                  {submission.originalFileName || submission.fileName || "N/A"}
                </td>

                <td>
                  <StatusBadge
                    status={
                      submission.plagiarismScore >= 70
                        ? "HIGH"
                        : submission.plagiarismScore >= 35
                        ? "MEDIUM"
                        : "LOW"
                    }
                  >
                    {submission.plagiarismScore ?? 0}%
                  </StatusBadge>
                </td>

                <td>
                  <StatusBadge
                    status={
                      submission.aiScore >= 70
                        ? "HIGH"
                        : submission.aiScore >= 35
                        ? "MEDIUM"
                        : "LOW"
                    }
                  >
                    {submission.aiScore ?? 0}%
                  </StatusBadge>
                </td>

                <td>
                  <StatusBadge status={submission.status} />
                </td>

                <td className="wrap-cell">{formatDateTime(submission.submittedAt)}</td>

                <td>
                  <div className="table-actions action-text-row">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(submission)}
                      className="action-text-btn"
                    >
                      <Eye size={15} />
                      View
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewReports?.(submission)}
                      className="action-text-btn"
                    >
                      <ShieldCheck size={15} />
                      Reports
                    </Button>

                    {role === "TEACHER" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEvaluate?.(submission)}
                        className="action-text-btn"
                      >
                        <FileCheck size={15} />
                        Evaluate
                      </Button>
                    )}

                    {role === "STUDENT" && submission.status === "EVALUATED" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(submission)}
                        className="action-text-btn"
                      >
                        <MessageSquareText size={15} />
                        Feedback
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTable;