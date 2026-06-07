import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const EvaluationBarChart = ({ evaluations = [] }) => {
  const chartData = evaluations.map((evaluation) => ({
    assignment: evaluation.assignment?.title || "Assignment",
    marks: evaluation.marks || 0,
    maxMarks: evaluation.assignment?.maxMarks || 100
  }));

  return (
    <div className="chart-card">
      <h3>Evaluation Marks</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="assignment" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="marks" name="Marks" />
          <Bar dataKey="maxMarks" name="Max Marks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvaluationBarChart;