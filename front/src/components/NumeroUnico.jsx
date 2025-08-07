const NumeroUnico = ({ value = 0, color = "#007BFF" }) => {
  return (
    <div
      style={{
        width: "50%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "70px",
          fontWeight: "bold",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default NumeroUnico;
