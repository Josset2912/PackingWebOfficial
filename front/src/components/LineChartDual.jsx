// LineChartDual.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

const colores = [
  "#FF6B6B",
  "#4ECDC4",
  "#1E90FF",
  "#FFA500",
  "#8A2BE2",
  "#20B2AA",
  "#FF69B4",
];

export default function LineChartDual({ data }) {
  const keys =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "rango")
      : [];

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <div style={{ width: Math.max(data.length * 100, 600) }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rango" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={`% ${key}`}
                stroke={colores[index % colores.length]}
                strokeWidth={2}
              >
                <LabelList dataKey={key} position="top" fontSize={10} />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
