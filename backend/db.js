require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false, // Cambia a true si usas Azure
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    if (typeof config.server !== "string" || !config.server) {
      throw new Error(`El valor de server es inválido: ${config.server}`);
    }

    await sql.connect(config);
  } catch (err) {
    throw err; // Importante: vuelve a lanzar para que el server.js lo detecte
  }
}

module.exports = { connectDB, sql, config };
