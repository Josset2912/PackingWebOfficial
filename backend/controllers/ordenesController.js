const sql = require("mssql");

// Obtener todas las órdenes
const getOrdenes = async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM Ordenes ORDER BY F_despacho DESC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo datos" });
  }
};

// Agregar una orden
const addOrden = async (req, res) => {
  const { PRIORIDAD, DESTINO, PRESENTACION, EJEC_PROY, F_DESPACHO } = req.body;
  try {
    await sql.query`
      INSERT INTO Ordenes (Prioridad, Destino, Presentacion, Ejec_proy, F_despacho)
      VALUES (${PRIORIDAD}, ${DESTINO}, ${PRESENTACION}, ${EJEC_PROY}, ${F_DESPACHO})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};

module.exports = { getOrdenes, addOrden };
