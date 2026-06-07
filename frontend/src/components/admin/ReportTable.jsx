import BaseReportTable from "../tables/ReportTable";

const ReportTable = ({
  reports = [],
  type = "plagiarism",
  onView
}) => {
  return (
    <BaseReportTable
      reports={reports}
      type={type}
      onView={onView}
    />
  );
};

export default ReportTable;