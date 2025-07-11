import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const GaugeChart = ({ value, max = 100, colors = {} }) => {
  const { progress = "#4CAF50", remaining = "#F0F0F0" } = colors;

  const adjustedValue = Math.min(Math.max(value, 0), max);
  const data = [
    { name: "Progreso", value: adjustedValue },
    { name: "Restante", value: max - adjustedValue },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "140px", // Más bajo para eliminar el espacio superior
        display: "flex",
        justifyContent: "center", // Centrar horizontalmente
        alignItems: "center", // Centrar verticalmente
        position: "relative",
        margin: "0",
        padding: "0",
        overflow: "hidden", // Por si algún contenido sobresale
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: -20, right: -10, bottom: -10, left: -10 }}>
          <Pie
            data={data}
            cx="50%"
            cy="70%" // Lleva el semicírculo completamente abajo
            startAngle={180}
            endAngle={0}
            innerRadius="60%" // Más delgado para dar mejor espacio
            outerRadius="100%" // Se expande al límite del contenedor
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={progress} />
            <Cell fill={remaining} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Valor numérico centrado */}
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "22px",
          fontWeight: "bold",
          color: "#333",
          margin: 0,
          padding: 0,
          lineHeight: 1,
        }}
      >
        {adjustedValue}%
      </div>
    </div>
  );
};

export default GaugeChart;
