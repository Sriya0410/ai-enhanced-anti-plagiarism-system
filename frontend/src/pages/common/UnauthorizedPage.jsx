import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import getRoleRedirect from "../../utils/getRoleRedirect";

const UnauthorizedPage = () => {
  const { user } = useAuth();

  const redirectPath = user ? getRoleRedirect(user.role) : "/login";

  return (
    <div className="state-page">
      <div className="state-card">
        <div className="state-icon danger">
          <Lock size={38} />
        </div>

        <h1>Unauthorized Access</h1>
        <p>
          You do not have permission to access this page. Please go back to your
          dashboard.
        </p>

        <Link to={redirectPath}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;