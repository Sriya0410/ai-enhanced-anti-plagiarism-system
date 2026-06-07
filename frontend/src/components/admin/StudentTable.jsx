import UserTable from "../tables/UserTable";

const StudentTable = ({
  students = [],
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <UserTable
      users={students}
      type="students"
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
    />
  );
};

export default StudentTable;