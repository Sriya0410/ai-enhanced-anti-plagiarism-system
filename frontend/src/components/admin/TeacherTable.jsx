import UserTable from "../tables/UserTable";

const TeacherTable = ({
  teachers = [],
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <UserTable
      users={teachers}
      type="teachers"
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
    />
  );
};

export default TeacherTable;