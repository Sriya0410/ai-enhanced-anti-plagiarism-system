import BaseAssignmentTable from "../tables/AssignmentTable";

const AssignmentTable = ({
  assignments = [],
  onView
}) => {
  return (
    <BaseAssignmentTable
      assignments={assignments}
      role="ADMIN"
      onView={onView}
    />
  );
};

export default AssignmentTable;