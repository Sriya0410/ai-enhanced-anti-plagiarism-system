import BaseSubmissionTable from "../tables/SubmissionTable";

const SubmissionTable = ({
  submissions = [],
  onView,
  onViewReports
}) => {
  return (
    <BaseSubmissionTable
      submissions={submissions}
      role="ADMIN"
      onView={onView}
      onViewReports={onViewReports}
    />
  );
};

export default SubmissionTable;