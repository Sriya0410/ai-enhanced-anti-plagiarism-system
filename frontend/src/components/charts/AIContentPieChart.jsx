import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const AIContentPieChart = ({ data }) => {
  const chartData = [
    { name: "Low", value: data?.low || 0 },
    { name: "Medium", value: data?.medium || 0 },
    { name: "High", value: data?.high || 0 }
  ];

  return (
    <div className="chart-card">
      <h3>AI Content Risk Distribution</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={85}
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AIContentPieChart;