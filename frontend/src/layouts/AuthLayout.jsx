import { Link, Outlet, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Button from "../components/common/Button";
import Footer from "../components/common/Footer";

const AuthLayout = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="auth-layout">
      <header className="auth-navbar">
        <Link to="/" className="auth-navbar-brand">
          <div className="auth-navbar-logo">
            <ShieldCheck size={27} />
          </div>

          <div>
            <h2>Anti-Plagiarism System</h2>
            <p>AI-Enhanced Assignment Submission</p>
          </div>
        </Link>

        <div className="auth-navbar-actions">
          

          {!isLoginPage && (
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          )}

          {!isRegisterPage && (
            <Link to="/register">
              <Button>Student Register</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="auth-layout-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;