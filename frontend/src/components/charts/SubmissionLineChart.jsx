import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatDate } from "../../utils/formatDate";

const SubmissionLineChart = ({ submissions = [] }) => {
  const grouped = {};

  submissions.forEach((submission) => {
    const date = formatDate(submission.submittedAt || submission.createdAt);
    grouped[date] = (grouped[date] || 0) + 1;
  });

  const chartData = Object.keys(grouped).map((date) => ({
    date,
    submissions: grouped[date]
  }));

  return (
    <div className="chart-card">
      <h3>Submission Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="submissions" name="Submissions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubmissionLineChart;