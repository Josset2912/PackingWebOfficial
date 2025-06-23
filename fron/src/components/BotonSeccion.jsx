import { motion } from "framer-motion";

const BotonSeccion = ({
  selectedOption,
  selectedButton,
  setSelectedButton,
}) => {
  if (!selectedOption) return null;

  const buttonConfig = {
    Arándano: [
      "RECEPCIÓN",
      "GASIFICADO PRE FRÍO",
      "ESPERA",
      "FRIO",
      "ORDEN PRD",
    ],
    Default: ["RECEPCIÓN", "GASIFICADO-VOLCADO", "ESPERA", "FRIO", "ORDEN PRD"],
  };

  const botones = buttonConfig[selectedOption] || buttonConfig.Default;

  // Estilos configurables
  const buttonStyles = {
    base: "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
    unselected:
      "bg-gray-100 text-gray-700 shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)]",
    selected:
      "bg-gradient-to-br from-gray-100 to-gray-200 text-purple-600 shadow-[inset_3px_3px_5px_rgba(0,0,0,0.1),inset_-3px_-3px_5px_rgba(255,255,255,0.8)]",
  };
  return (
    <div className="flex flex-wrap justify-center gap-3 p-4">
      {botones.map((nombre) => (
        <motion.button
          key={nombre}
          className={`${buttonStyles.base} ${
            selectedButton === nombre
              ? buttonStyles.selected
              : buttonStyles.unselected
          }`}
          whileHover={{
            scale: selectedButton === nombre ? 1 : 1.05,
            boxShadow:
              selectedButton === nombre
                ? "0 4px 8px rgba(0,0,0,0.1)"
                : "0 2px 4px rgba(0,0,0,0.1)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedButton(nombre)}
          aria-current={selectedButton === nombre ? "true" : "false"}
        >
          {nombre}
        </motion.button>
      ))}
    </div>
  );
};

export default BotonSeccion;
