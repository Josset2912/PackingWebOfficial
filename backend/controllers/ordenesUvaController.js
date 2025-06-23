const sql = require("mssql");

// Obtener todas las órdenes
const getOrdenesUva = async (req, res) => {
  try {
    const result =
      await sql.query`exec SP_MOSTRAR_PACKING_RECEPCION_TV '','','ARANDANO'`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo datos" });
  }
};

// Agregar una orden
const addOrdenUva = async (req, res) => {
  const { Prioridad, Destino, Presentacion, Ejec_proy, F_Despacho } = req.body;
  try {
    await sql.query`
      INSERT INTO ordenes_uva (Prioridad, Destino, Presentacion, Ejec_proy, F_despacho)
      VALUES (${Prioridad}, ${Destino}, ${Presentacion}, ${Ejec_proy}, ${F_Despacho})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};

module.exports = { getOrdenesUva, addOrdenUva };
