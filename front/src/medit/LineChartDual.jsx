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
import { useTheme } from "../contexts/ThemeContext";

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
  const { isDarkMode } = useTheme();

  const keys =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "rango")
      : [];

  // Estilos según el tema
  const axisStyle = {
    stroke: isDarkMode ? "#9ca3af" : "#374151",
    fill: isDarkMode ? "#9ca3af" : "#374151",
  };

  const gridStyle = {
    stroke: "#ffffff",
  };

  const tooltipStyle = {
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
    color: isDarkMode ? "#f9fafb" : "#111827",
  };

  const labelStyle = {
    fill: isDarkMode ? "#e5e7eb" : "#374151",
  };

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <div style={{ width: Math.max(data.length * 100, 600) }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
            <XAxis dataKey="rango" {...axisStyle} />
            <YAxis {...axisStyle} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDarkMode ? "#f9fafb" : "#111827" }}
            />
            <Legend
              align="center"
              wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }}
            />
            {keys.map((key, index) => (
              <Line
                key={key}
                type="lynear"
                dataKey={key}
                name={`% ${key}`}
                stroke={
                  isDarkMode ? "#ffffff" : colores[index % colores.length]
                }
                strokeWidth={2}
              >
                <LabelList
                  dataKey={key}
                  position="top"
                  fontSize={10}
                  {...labelStyle}
                />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
