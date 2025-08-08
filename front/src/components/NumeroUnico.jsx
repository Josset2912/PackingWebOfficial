import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const NumeroUnico = ({ value = 0, color = "#007BFF", duration = 2.5 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3, // Ajusta este valor según cuando quieres que se active
  });

  return (
    <div
      style={{
        width: "50%",
        textAlign: "center",
      }}
      ref={ref}
    >
      <div
        style={{
          fontSize: "70px",
          fontWeight: "bold",
          color,
        }}
      >
        {inView ? (
          <CountUp
            end={value}
            duration={duration}
            decimals={value % 1 !== 0 ? 2 : 0} // Maneja decimales si es necesario
            separator=","
          />
        ) : (
          <span>0</span>
        )}
      </div>
    </div>
  );
};

export default NumeroUnico;
