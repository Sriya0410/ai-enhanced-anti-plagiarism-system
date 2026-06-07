import BaseAssignmentCard from "../cards/AssignmentCard";

const AssignmentCard = ({
  assignment,
  onView,
  onSubmit
}) => {
  return (
    <BaseAssignmentCard
      assignment={assignment}
      onView={onView}
      onSubmit={onSubmit}
      showSubmit
    />
  );
};

export default AssignmentCard;