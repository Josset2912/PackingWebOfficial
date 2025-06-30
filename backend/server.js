require("dotenv").config();
const express = require("express");
const cors = require("cors");
const os = require("os");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 8650; // Cambia el puerto según tu configuración 8650

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Conectar a la base de datos antes de iniciar el servidor
db.connectDB()
  .then(() => {

    // Importar rutas ARÁNDANOS
    const recepcionAranRoutes = require("./routes/recepcionAranRoutes.js");
    const gasificadoPreAranRoutes = require("./routes/gasificadoPreAranRoutes.js");
    const gasificadoBatchPreAranRoutes = require("./routes/gasificadoBatchPreAranRoutes.js");
    const gasificadoPreFrioAranRoutes = require("./routes/gasificado_preFrioAranRoutes.js");
    const gasificadoBatchPreFrioAranRoutes = require("./routes/gasificado_BatchpreFrioAranRoutes.js");

    const esperaVolcadoAranRoutes = require("./routes/esperaVolcadoAranRoutes.js");
    const esperaFrioAranRoutes = require("./routes/EsperaFrioAranRoutes.js"); //espera frio arandano
    const enfriandoAranRoutes = require("./routes/enfriandoAranRoutes.js"); //enfriando  arandano
    const avanceLineaRoutes = require("./routes/avanceLineaRoutes.js"); //avance linea arandano
    const ordenesPTAranRoutes = require("./routes/ordenesPTAranRoutes.js");

    // Registrar rutas ARÁNDANOS
    app.use("/api/recepcionAran", recepcionAranRoutes);
    app.use("/api/gasificadoPreAran", gasificadoPreAranRoutes);
    app.use("/api/gasificadoBatchPreAran", gasificadoBatchPreAranRoutes);
    app.use("/api/gasificadoPreFrioAran", gasificadoPreFrioAranRoutes);
    app.use(
      "/api/gasificadoBatchPreFrioAran",
      gasificadoBatchPreFrioAranRoutes
    );
    app.use("/api/esperaVolcadoAran", esperaVolcadoAranRoutes);
    app.use("/api/esperaFrioAran", esperaFrioAranRoutes); //espera frio arandano
    app.use("/api/enfriandoAran", enfriandoAranRoutes); //enfriando arandano
    app.use("/api/avanceLinea", avanceLineaRoutes); //avance linea arandano
    app.use("/api/ordenesPTAran", ordenesPTAranRoutes);

    //-----------------------------------------------------------------//

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      // Mostrar IPs locales disponibles
      const networkInterfaces = os.networkInterfaces();
      Object.keys(networkInterfaces).forEach((ifname) => {
        networkInterfaces[ifname].forEach((iface) => {
          if (iface.family === "IPv4" && !iface.internal) {
            console.log(
              `🌐 Acceso disponible en: http://${iface.address}:${PORT}`
            );
          }
        });
      });
    });
  })
  .catch((error) => {
    //console.error("❌ Error conectando a la base de datos:", error);
  });
