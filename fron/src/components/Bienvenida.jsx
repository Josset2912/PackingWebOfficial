import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Bienvenida = ({ onStart }) => {
  const [texto, setTexto] = useState("");
  const [index, setIndex] = useState(0);
  const textoCompleto = "Bienvenido a Santa Azul";

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index < textoCompleto.length) {
        setTexto((prevTexto) => prevTexto + textoCompleto[index]);
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        setTimeout(() => {
          onStart(); // Llama a onStart automáticamente después de 2 segundos
        }, 2000);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [index, onStart]); // Añade onStart a las dependencias

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white text-center p-6">
      <h1 className="mb-4 text-6xl md:text-7xl font-bold flex items-center gap-4">
        {texto}
        <motion.svg
          height="80px"
          width="80px"
          viewBox="0 0 512 512"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <g>
            <path
              style={{ fill: "#91DC5A" }}
              d="M245.768,116.773V0l-9.516,5.148c-46.067,24.921-73.57,66.65-73.57,111.625 c0,41.446,23.37,80.123,63.086,105.443V116.773H245.768z"
            ></path>
            <path
              style={{ fill: "#6DC82A" }}
              d="M265.768,116.773v105.443c39.717-25.319,63.086-63.997,63.086-105.443 c0-44.975-27.503-86.704-73.57-111.625L245.768,0v116.773H265.768z"
            ></path>
            <path
              style={{ fill: "#91DC5A" }}
              d="M373.386,238.221l85.608-50.888l-9.288-5.55c-20.011-11.957-41.657-18.277-62.599-18.277 c-17.854,0-34.414,4.462-49.216,13.261c-29.396,17.474-47.198,49.969-48.988,88.406l74.263-44.144L373.386,238.221z"
            ></path>
            <path
              style={{ fill: "#6DC82A" }}
              d="M383.606,255.413l-74.251,44.137c16.888,8.184,34.602,12.476,51.84,12.476 c17.854,0,34.415-4.462,49.217-13.261c32.463-19.297,50.789-56.913,49.021-100.622l-0.438-10.811l-85.608,50.888L383.606,255.413z"
            ></path>
          </g>
        </motion.svg>
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mb-6 text-lg md:text-3xl font-semibold"
      >
        Cultivamos con amor para llevar al mundo los mejores <br />
        arándanos, frescos y de sabor único.
      </motion.p>
      <motion.img
        src="../santa.png"
        alt="Santa Azul"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="w-40 md:w-64 lg:w-80"
      />
    </div>
  );
};

export default Bienvenida;
