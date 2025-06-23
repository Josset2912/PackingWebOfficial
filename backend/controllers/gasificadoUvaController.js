const { sql } = require("../db"); // Importa la conexión

const getGasificadoUva = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM gasificado_uva"); // 🔥 Verifica que la tabla sea correcta
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error obteniendo datos de gasificado_pre:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
};

//AGREGAR UNA ORDEN
const addOrden = async (req, res) => {
  const { Espera, PALET_D } = req.body; // Desestructurando el cuerpo de la solicitud
  try {
    await sql.query`
                INSERT INTO gasificado_uva (Espera, PALET_D)
                VALUES (${Espera}, ${PALET_D}})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (error) {
    console.error("❌ Error insertando datos:", error);
    res.status(500).json({ error: "Error insertando datos" });
  }
};
module.exports = { getGasificadoUva, addOrden }; // 🔥 EXPORTA BIEN la función
