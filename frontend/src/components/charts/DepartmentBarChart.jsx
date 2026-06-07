import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const DepartmentBarChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item.department?.code || item.name || "N/A",
    students: item.totalStudents || item.students || 0,
    assignments: item.totalAssignments || item.assignments || 0,
    submissions: item.totalSubmissions || item.submissions || 0
  }));

  return (
    <div className="chart-card">
      <h3>Department Activity</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="students" name="Students" />
          <Bar dataKey="assignments" name="Assignments" />
          <Bar dataKey="submissions" name="Submissions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentBarChart;