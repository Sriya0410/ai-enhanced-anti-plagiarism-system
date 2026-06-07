import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import Button from "../../components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="state-page">
      <div className="state-card">
        <div className="state-icon">
          <SearchX size={38} />
        </div>

        <h1>Page Not Found</h1>
        <p>
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;