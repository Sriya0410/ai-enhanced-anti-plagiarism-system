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
  Building2,
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { getErrorMessage } from "../../api/axios";
import { getSystemAnalytics } from "../../api/dashboardApi";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

const RISK_COLORS = {
  Low: "#16a34a",
  Medium: "#f59e0b",
  High: "#ef4444"
};

const BAR_COLORS = {
  students: "#4f46e5",
  assignments: "#06b6d4",
  submissions: "#db2777"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="analytics-tooltip">
      {label && <h4>{label}</h4>}

      {payload.map((item) => (
        <p key={item.dataKey || item.name}>
          <span
            style={{
              background: item.color || item.fill
            }}
          />
          {item.name}: <strong>{item.value}</strong>
        </p>
      ))}
    </div>
  );
};

const RiskLegend = ({ data = [] }) => {
  return (
    <div className="risk-legend">
      {data.map((item) => (
        <div className="risk-legend-item" key={item.name}>
          <span style={{ background: RISK_COLORS[item.name] }} />
          <p>{item.name}</p>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
};

const SystemAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSystemAnalytics();
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

  const departmentData = useMemo(() => {
    return (
      analytics?.departmentStats?.map((item) => ({
        name: item.department?.code || "N/A",
        department: item.department?.name || "Department",
        students: item.totalStudents || 0,
        assignments: item.totalAssignments || 0,
        submissions: item.totalSubmissions || 0
      })) || []
    );
  }, [analytics]);

  const totals = useMemo(() => {
    const totalPlagiarism = plagiarismData.reduce(
      (sum, item) => sum + item.value,
      0
    );

    const totalAI = aiData.reduce((sum, item) => sum + item.value, 0);

    const totalStudents = departmentData.reduce(
      (sum, item) => sum + item.students,
      0
    );

    const totalAssignments = departmentData.reduce(
      (sum, item) => sum + item.assignments,
      0
    );

    const totalSubmissions = departmentData.reduce(
      (sum, item) => sum + item.submissions,
      0
    );

    return {
      totalPlagiarism,
      totalAI,
      totalStudents,
      totalAssignments,
      totalSubmissions
    };
  }, [plagiarismData, aiData, departmentData]);

  if (loading) {
    return <Loader text="Loading analytics..." />;
  }

  return (
    <div className="analytics-page">
      <section className="analytics-hero">
        <div>
          <p className="analytics-kicker">
            <Sparkles size={16} />
            System Intelligence
          </p>

          <h1>System Analytics</h1>

          <p>
            Visual overview of plagiarism reports, AI-content risk,
            submissions, assignments, and department-wise academic activity.
          </p>
        </div>

        <div className="analytics-hero-card">
          <div className="analytics-hero-icon">
            <TrendingUp size={30} />
          </div>

          <h2>{totals.totalSubmissions}</h2>
          <p>Total Submissions</p>
          <span>Across all departments</span>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="analytics-stat-grid">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <Building2 size={24} />
          </div>
          <div>
            <p>Total Students</p>
            <h2>{totals.totalStudents}</h2>
            <span>Department mapped users</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon cyan">
            <FileCheck size={24} />
          </div>
          <div>
            <p>Assignments</p>
            <h2>{totals.totalAssignments}</h2>
            <span>Created across system</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon pink">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p>Plagiarism Reports</p>
            <h2>{totals.totalPlagiarism}</h2>
            <span>Similarity analysis</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon purple">
            <Brain size={24} />
          </div>
          <div>
            <p>AI Reports</p>
            <h2>{totals.totalAI}</h2>
            <span>AI writing analysis</span>
          </div>
        </div>
      </div>

      <div className="analytics-chart-grid">
        <div className="premium-chart-card">
          <div className="chart-title-row">
            <div>
              <p>Risk Distribution</p>
              <h3>Plagiarism Analysis</h3>
            </div>

            <div className="chart-badge danger">
              <ShieldAlert size={16} />
              Similarity
            </div>
          </div>

          <div className="donut-chart-wrap">
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={plagiarismData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={94}
                  paddingAngle={5}
                  label
                >
                  {plagiarismData.map((entry) => (
                    <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <RiskLegend data={plagiarismData} />
        </div>

        <div className="premium-chart-card">
          <div className="chart-title-row">
            <div>
              <p>Risk Distribution</p>
              <h3>AI Content Analysis</h3>
            </div>

            <div className="chart-badge purple">
              <Brain size={16} />
              AI Score
            </div>
          </div>

          <div className="donut-chart-wrap">
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={aiData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={94}
                  paddingAngle={5}
                  label
                >
                  {aiData.map((entry) => (
                    <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <RiskLegend data={aiData} />
        </div>
      </div>

      <div className="premium-chart-card full-chart-card">
        <div className="chart-title-row">
          <div>
            <p>Department Overview</p>
            <h3>Department Activity</h3>
          </div>

          <div className="chart-badge">
            <BarChart3 size={16} />
            Activity
          </div>
        </div>

        {departmentData.length ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={departmentData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="students"
                name="Students"
                fill={BAR_COLORS.students}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="assignments"
                name="Assignments"
                fill={BAR_COLORS.assignments}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="submissions"
                name="Submissions"
                fill={BAR_COLORS.submissions}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="analytics-empty-chart">
            <BarChart3 size={42} />
            <h3>No department activity yet</h3>
            <p>Charts will update automatically after assignments and submissions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAnalytics;