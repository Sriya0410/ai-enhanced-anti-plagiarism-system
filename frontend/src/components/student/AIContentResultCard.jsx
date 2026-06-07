import StatusBadge from "../common/StatusBadge";

const AIContentResultCard = ({ report, score = 0 }) => {
  const finalScore = report?.aiScore ?? score ?? 0;

  const level =
    report?.level ||
    (finalScore >= 70 ? "HIGH" : finalScore >= 35 ? "MEDIUM" : "LOW");

  return (
    <div className="report-score-card ai">
      <h2>{finalScore}%</h2>
      <p>AI Content Score</p>
      <StatusBadge status={level} />
      <span>{report?.summary || "AI content report generated automatically."}</span>
    </div>
  );
};

export default AIContentResultCard;