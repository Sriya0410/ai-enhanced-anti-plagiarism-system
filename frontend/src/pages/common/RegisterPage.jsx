import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UploadCloud
} from "lucide-react";
import { useState } from "react";
import RegisterForm from "../../components/forms/RegisterForm";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (payload) => {
    setLoading(true);
    setError("");

    const result = await register(payload);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/login", {
      replace: true,
      state: {
        successMessage: "Registration successful. Please login to continue."
      }
    });
  };

  return (
    <div className="auth-page premium-auth-page register-premium-page">
      <section className="auth-visual-panel register-visual-panel">
        <div className="auth-visual-badge">
          <Sparkles size={16} />
          Student Registration
        </div>

        <h1>Create your student account and start submitting assignments.</h1>

        <p>
          Register once, access your assignments, upload files, and view
          plagiarism, AI-content reports, marks, and teacher feedback.
        </p>

        <div className="auth-visual-grid">
          <div>
            <GraduationCap size={24} />
            <h3>Student Portal</h3>
            <span>Assignments and feedback</span>
          </div>

          <div>
            <UploadCloud size={24} />
            <h3>Easy Upload</h3>
            <span>PDF, DOCX, and TXT files</span>
          </div>
        </div>
      </section>

      <section className="auth-card wide premium-auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <ShieldCheck size={30} />
          </div>

          <h1>Create Student Account</h1>
          <p>Register as a student and start submitting assignments.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <RegisterForm onSubmit={handleRegister} loading={loading} />

        <div className="auth-switch">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;