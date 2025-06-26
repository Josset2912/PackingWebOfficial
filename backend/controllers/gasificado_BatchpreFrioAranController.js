// controllers/gasificadoPreAranController.js
const { sql } = require("../db");

const getGasificadoBatchPreFrioAran = async (req, res) => {
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)
    const result = await pool
      .request()
      .query(`exec SP_MOSTRAR_PACKING_PREFRIO_BATCH_TV '','','ARANDANO'`); // Ajusta la consulta si es necesario
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error obteniendo datos de gasificado_pre_aran:", error);
    res
      .status(500)
      .json({ error: "Error al obtener datos de gasificado_pre_aran" });
  }
};

module.exports = { getGasificadoBatchPreFrioAran };

{
  /*
    const getGasificadoPreAran = async (req, res) => {
  try {
    const result = await sql.query();
    res.json(result.recordset);
  } catch (error) {
    console.error("Error en gasificado_pre_aran:", error);
    res.status(500).json({
      error: "Error al obtener datos de gasificado arándano",
      details: error.message,
    });
  }
};  
*/
}

//AGREGAR UNA ORDEN

{
  /*
    const addOrden = async (req, res) => {
  const { PALET, ESPERA, TOTAL } = req.body; // Desestructurando el cuerpo de la solicitud
  try {
    await sql.query`
                INSERT INTO gasificado_pre_aran (Palet, Espera, TOTAL)
                VALUES (${PALET}, ${ESPERA}, ${TOTAL})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};
    
    
*/
}
