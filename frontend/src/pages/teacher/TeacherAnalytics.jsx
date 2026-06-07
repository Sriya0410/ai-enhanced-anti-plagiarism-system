import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  BarChart3,
  Brain,
  ClipboardCheck,
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { getErrorMessage } from "../../api/axios";
import { getTeacherAnalytics } from "../../api/teacherApi";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

const RISK_COLORS = {
  Low: "#16a34a",
  Medium: "#f59e0b",
  High: "#ef4444"
};

const BAR_COLORS = {
  low: "#16a34a",
  medium: "#f59e0b",
  high: "#ef4444"
};

const TeacherTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="teacher-analytics-tooltip">
      {label && <h4>{label}</h4>}

      {payload.map((item) => (
        <p key={item.dataKey || item.name}>
          <span style={{ background: item.color || item.fill }} />
          {item.name}: <strong>{item.value}</strong>
        </p>
      ))}
    </div>
  );
};

const RiskLegend = ({ data = [] }) => {
  return (
    <div className="teacher-risk-legend">
      {data.map((item) => (
        <div className="teacher-risk-legend-item" key={item.name}>
          <span style={{ background: RISK_COLORS[item.name] }} />
          <p>{item.name}</p>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
};

const TeacherAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTeacherAnalytics();
      setAnalytics(response?.data?.data?.analytics || {});
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const plagiarismData = useMemo(
    () => [
      { name: "Low", value: analytics?.plagiarism?.low || 0 },
      { name: "Medium", value: analytics?.plagiarism?.medium || 0 },
      { name: "High", value: analytics?.plagiarism?.high || 0 }
    ],
    [analytics]
  );

  const aiData = useMemo(
    () => [
      { name: "Low", value: analytics?.aiContent?.low || 0 },
      { name: "Medium", value: analytics?.aiContent?.medium || 0 },
      { name: "High", value: analytics?.aiContent?.high || 0 }
    ],
    [analytics]
  );

  const summaryData = useMemo(
    () => [
      {
        name: "Plagiarism",
        low: plagiarismData[0].value,
        medium: plagiarismData[1].value,
        high: plagiarismData[2].value
      },
      {
        name: "AI Content",
        low: aiData[0].value,
        medium: aiData[1].value,
        high: aiData[2].value
      }
    ],
    [plagiarismData, aiData]
  );

  const totals = useMemo(() => {
    const plagiarismTotal = plagiarismData.reduce(
      (sum, item) => sum + item.value,
      0
    );

    const aiTotal = aiData.reduce((sum, item) => sum + item.value, 0);

    const highRisk =
      (analytics?.plagiarism?.high || 0) + (analytics?.aiContent?.high || 0);

    const mediumRisk =
      (analytics?.plagiarism?.medium || 0) +
      (analytics?.aiContent?.medium || 0);

    return {
      plagiarismTotal,
      aiTotal,
      highRisk,
      mediumRisk,
      totalReports: plagiarismTotal + aiTotal
    };
  }, [plagiarismData, aiData, analytics]);

  if (loading) {
    return <Loader text="Loading analytics..." />;
  }

  return (
    <div className="teacher-analytics-page">
      <PageHeader
        title="Teacher Analytics"
        subtitle="Track plagiarism risk, AI-content risk, and submission quality for your assignments."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <section className="teacher-analytics-summary">
        <div className="teacher-summary-card primary">
          <div className="teacher-summary-icon">
            <TrendingUp size={24} />
          </div>

          <div>
            <p>Total Reports</p>
            <h2>{totals.totalReports}</h2>
            <span>Plagiarism + AI report count</span>
          </div>
        </div>

        <div className="teacher-summary-card">
          <div className="teacher-summary-icon green">
            <ShieldCheck size={24} />
          </div>

          <div>
            <p>Plagiarism Reports</p>
            <h2>{totals.plagiarismTotal}</h2>
            <span>Similarity risk analysis</span>
          </div>
        </div>

        <div className="teacher-summary-card">
          <div className="teacher-summary-icon purple">
            <Brain size={24} />
          </div>

          <div>
            <p>AI Reports</p>
            <h2>{totals.aiTotal}</h2>
            <span>AI-writing pattern analysis</span>
          </div>
        </div>

        <div className="teacher-summary-card">
          <div className="teacher-summary-icon red">
            <ShieldAlert size={24} />
          </div>

          <div>
            <p>High Risk</p>
            <h2>{totals.highRisk}</h2>
            <span>Needs teacher attention</span>
          </div>
        </div>
      </section>

      <section className="teacher-analytics-insight">
        <div>
          <p>
            <Sparkles size={15} />
            Evaluation Insight
          </p>
          <h3>Review high-risk submissions first</h3>
          <span>
            Prioritize submissions with high plagiarism or AI-content scores
            before final evaluation.
          </span>
        </div>

        <div className="teacher-insight-badges">
          <span>{totals.mediumRisk} Medium Risk</span>
          <span>{totals.highRisk} High Risk</span>
        </div>
      </section>

      <div className="teacher-chart-grid">
        <div className="teacher-chart-card">
          <div className="teacher-chart-header">
            <div>
              <p>Risk Distribution</p>
              <h3>Plagiarism Risk</h3>
            </div>

            <div className="teacher-chart-chip danger">
              <ShieldAlert size={16} />
              Similarity
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={plagiarismData}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={5}
                label
              >
                {plagiarismData.map((entry) => (
                  <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                ))}
              </Pie>

              <Tooltip content={<TeacherTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <RiskLegend data={plagiarismData} />
        </div>

        <div className="teacher-chart-card">
          <div className="teacher-chart-header">
            <div>
              <p>Risk Distribution</p>
              <h3>AI Content Risk</h3>
            </div>

            <div className="teacher-chart-chip purple">
              <Brain size={16} />
              AI Score
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={aiData}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={5}
                label
              >
                {aiData.map((entry) => (
                  <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                ))}
              </Pie>

              <Tooltip content={<TeacherTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <RiskLegend data={aiData} />
        </div>
      </div>

      <div className="teacher-chart-card full">
        <div className="teacher-chart-header">
          <div>
            <p>Combined Overview</p>
            <h3>Risk Summary</h3>
          </div>

          <div className="teacher-chart-chip">
            <BarChart3 size={16} />
            Summary
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={summaryData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<TeacherTooltip />} />

            <Bar
              dataKey="low"
              name="Low"
              fill={BAR_COLORS.low}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="medium"
              name="Medium"
              fill={BAR_COLORS.medium}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="high"
              name="High"
              fill={BAR_COLORS.high}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="teacher-analytics-note-grid">
        <div className="teacher-note-card">
          <ClipboardCheck size={24} />
          <h3>Evaluation Priority</h3>
          <p>
            Start checking submissions with high plagiarism or high AI score.
            These need careful manual review.
          </p>
        </div>

        <div className="teacher-note-card">
          <FileCheck size={24} />
          <h3>Feedback Quality</h3>
          <p>
            Add clear feedback explaining originality, writing style, examples,
            and improvement points.
          </p>
        </div>

        <div className="teacher-note-card">
          <ShieldCheck size={24} />
          <h3>Academic Integrity</h3>
          <p>
            Use reports as support evidence, but final marks should include your
            academic judgment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;