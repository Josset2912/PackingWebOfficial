// gasificadoPreController.js
const { sql } = require("../db");

const getGasificadoPre = async (req, res) => {
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)
    const result = await pool
      .request()
      .query(`exec SP_MOSTRAR_PACKING_GASIFICADO_ESPERA_TV '','','ARANDANO'`);
    // Ajusta la consulta si es necesario
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error obteniendo datos de gasificado_pre:", error);
    res.status(500).json({ error: "Error al obtener datos de gasificado_pre" });
  }
};

module.exports = { getGasificadoPre };

{
  /*
    const getGasificadoPre = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM gasificado_pre");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error en gasificado_pre:", error);
    res.status(500).json({ error: "Error al obtener datos de gasificado" });
  }
};
    
*/
}

//AGREGAR UNA ORDEN
{
  /*
    const addOrden = async (req, res) => {
  const { PALET, ESPERA } = req.body; // Desestructurando el cuerpo de la solicitud
  try {
    await sql.query`
                INSERT INTO gasificado_pre (Palet, Espera)
                VALUES (${PALET}, ${ESPERA})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};  
    */
}
