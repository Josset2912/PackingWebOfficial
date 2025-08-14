import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const GaugeChart = ({ value, max = 100, colors = {} }) => {
  const { progress = "#4CAF50", remaining = "#F0F0F0" } = colors;

  // Para el color (máximo 100%)
  const adjustedValue = Math.min(Math.max(value, 0), max);

  // Para mostrar el porcentaje real
  const displayValue = value;

  const data = [
    { name: "Progreso", value: adjustedValue },
    { name: "Restante", value: max - adjustedValue },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "140px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        margin: "0",
        padding: "3px",
        overflow: "hidden",
      }}
    >
      <ResponsiveContainer width="140%" height="140%">
        <PieChart margin={{ top: -20, right: -10, bottom: -20, left: -10 }}>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={progress} />
            <Cell fill={remaining} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Texto centrado con el valor original */}
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "30px",
          fontWeight: "bold",
          color: "#333",
          lineHeight: 1,
        }}
      >
        {displayValue}%
      </div>
    </div>
  );
};

export default GaugeChart;
