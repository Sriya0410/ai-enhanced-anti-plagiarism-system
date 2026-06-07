import { useEffect, useState } from "react";
import { getAssignments } from "../../api/assignmentApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import AssignmentTable from "../../components/tables/AssignmentTable";

const AllAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignments();
      setAssignments(response?.data?.data?.assignments || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) {
    return <Loader text="Loading assignments..." />;
  }

  return (
    <div>
      <PageHeader
        title="All Assignments"
        subtitle="View all assignments created by teachers across departments."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <AssignmentTable assignments={assignments} role="ADMIN" />
    </div>
  );
};

export default AllAssignments;