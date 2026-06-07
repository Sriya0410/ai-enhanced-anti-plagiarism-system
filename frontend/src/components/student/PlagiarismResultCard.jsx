import StatusBadge from "../common/StatusBadge";

const PlagiarismResultCard = ({ report, score = 0 }) => {
  const finalScore = report?.similarityScore ?? score ?? 0;

  const level =
    report?.level ||
    (finalScore >= 70 ? "HIGH" : finalScore >= 35 ? "MEDIUM" : "LOW");

  return (
    <div className="report-score-card plagiarism">
      <h2>{finalScore}%</h2>
      <p>Plagiarism Score</p>
      <StatusBadge status={level} />
      <span>{report?.summary || "Plagiarism report generated automatically."}</span>
    </div>
  );
};

export default PlagiarismResultCard;