import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import LoginForm from "../../components/forms/LoginForm";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import getRoleRedirect from "../../utils/getRoleRedirect";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (payload) => {
    setLoading(true);
    setError("");

    const result = await login(payload);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    const redirectPath =
      location.state?.from?.pathname || getRoleRedirect(result.user.role);

    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="auth-page premium-auth-page login-auth-page">
      <section className="auth-visual-panel">
        <div className="auth-visual-badge">
          <Sparkles size={16} />
          Secure Academic Portal
        </div>

        <h1>Welcome back to your smart assignment checking system.</h1>

        <p>
          Login to manage assignments, view reports, evaluate submissions, or
          track your academic feedback.
        </p>

        <div className="auth-visual-grid">
          <div>
            <ShieldCheck size={24} />
            <h3>Plagiarism Reports</h3>
            <span>Automatic similarity checking</span>
          </div>

          <div>
            <LockKeyhole size={24} />
            <h3>Secure Login</h3>
            <span>Role-based protected access</span>
          </div>
        </div>
      </section>

      <section className="auth-card premium-auth-card">
        

        <div className="auth-brand">
          <div className="auth-logo">
            <ShieldCheck size={30} />
          </div>

          <h1>Login</h1>
          <p>Enter your credentials to continue.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <LoginForm onSubmit={handleLogin} loading={loading} />

        <div className="auth-switch">
          <span>New student?</span>
          <Link to="/register">Create account</Link>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;