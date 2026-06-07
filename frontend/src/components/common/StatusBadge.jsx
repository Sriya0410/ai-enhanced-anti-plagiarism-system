const getStatusClass = (status = "") => {
  const value = String(status).toUpperCase();

  if (
    value === "ACTIVE" ||
    value === "PUBLISHED" ||
    value === "CHECKED" ||
    value === "EVALUATED" ||
    value === "LOW"
  ) {
    return "success";
  }

  if (
    value === "DRAFT" ||
    value === "SUBMITTED" ||
    value === "MEDIUM" ||
    value === "PENDING"
  ) {
    return "warning";
  }

  if (
    value === "INACTIVE" ||
    value === "CLOSED" ||
    value === "REJECTED" ||
    value === "HIGH"
  ) {
    return "danger";
  }

  return "neutral";
};

const StatusBadge = ({ status, children }) => {
  const displayStatus =
    typeof status === "boolean" ? (status ? "ACTIVE" : "INACTIVE") : status;

  return (
    <span className={`status-badge status-${getStatusClass(displayStatus)}`}>
      {children || displayStatus || "N/A"}
    </span>
  );
};

export default StatusBadge;