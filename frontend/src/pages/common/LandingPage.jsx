import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  FileCheck,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UsersRound
} from "lucide-react";
import Button from "../../components/common/Button";

const LandingPage = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Plagiarism Detection",
      text: "Compares submissions with previous student work and generates similarity reports."
    },
    {
      icon: Brain,
      title: "AI Content Detection",
      text: "Analyzes writing patterns and gives an AI-content risk score automatically."
    },
    {
      icon: FileCheck,
      title: "Smart Evaluation",
      text: "Teachers can review reports, add marks, and share feedback from one portal."
    }
  ];

  const stats = [
    {
      value: "3",
      label: "User Roles"
    },
    {
      value: "Auto",
      label: "Report Mode"
    },
    {
      value: "PDF",
      label: "DOCX, TXT"
    },
    {
      value: "Secure",
      label: "JWT Access"
    }
  ];

  return (
    <div className="landing-page">
      

      <main className="landing-hero">
        <section className="landing-hero-content">
          <div className="landing-badge">
            <Sparkles size={16} />
            Academic Integrity Platform
          </div>

          <h1>
            Detect plagiarism and AI-written assignments with one smart portal.
          </h1>

          <p className="landing-description">
            A premium role-based system where students submit assignments,
            teachers evaluate work, and reports are generated automatically for
            plagiarism and AI-like content.
          </p>

          <div className="landing-hero-actions">
            <Link to="/login">
              <Button>
                Login to Portal 
              </Button>
            </Link>

            <Link to="/register">
              <Button variant="secondary">Create Student Account</Button>
            </Link>
          </div>

          <div className="landing-trust-row">
            <span>
              <CheckCircle2 size={17} />
              Auto Reports
            </span>
            <span>
              <CheckCircle2 size={17} />
              Role-Based Access
            </span>
            <span>
              <CheckCircle2 size={17} />
              Teacher Feedback
            </span>
          </div>
        </section>

        <section className="landing-visual">
          <div className="premium-dashboard-card">
            <div className="dashboard-card-top">
              <div>
                <p>System Scan</p>
                <h3>Assignment Report</h3>
              </div>

              <div className="scan-status">
                <span />
                Live
              </div>
            </div>

            <div className="score-orbit">
              <div className="score-ring">
                <h2>92%</h2>
                <p>Scan Complete</p>
              </div>
            </div>

            <div className="mini-report-grid">
              <div className="mini-report-card plagiarism">
                <ShieldCheck size={22} />
                <p>Plagiarism</p>
                <h4>Low Risk</h4>
              </div>

              <div className="mini-report-card ai">
                <Brain size={22} />
                <p>AI Content</p>
                <h4>Medium</h4>
              </div>
            </div>
          </div>

        </section>
      </main>

      

      <section className="landing-features" id="features">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">
                <Icon size={28} />
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          );
        })}
      </section>

    </div>
  );
};

export default LandingPage;