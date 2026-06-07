import BaseSubmissionCard from "../cards/SubmissionCard";

const SubmissionCard = ({
  submission,
  onView,
  onViewReports
}) => {
  return (
    <BaseSubmissionCard
      submission={submission}
      onView={onView}
      onViewReports={onViewReports}
    />
  );
};

export default SubmissionCard;