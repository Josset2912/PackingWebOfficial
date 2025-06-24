require("dotenv").config();
const express = require("express");
const cors = require("cors");
const os = require("os");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 8650;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a la base de datos antes de iniciar el servidor
db.connectDB()
  .then(() => {
    console.log("✅ Conexión establecida con SQL Server");

    // Importar rutas ARÁNDANOS
    const ordenesRoutes = require("./routes/ordenesRoutes");
    const gasificadoPreRoutes = require("./routes/gasificadoPreRoutes");
    const esperaRoutes = require("./routes/esperaRoutes");
    const recepcionRoutes = require("./routes/recepcionRoutes");
    const frioRoutes = require("./routes/frioRoutes");
    const segundaTablaRoutes = require("./routes/gasificado_pre_aranRoutes");
    const frioArandano = require("./routes/frio_arandanoRoutes");

    // Importar rutas UVA
    const esperaUvaRoutes = require("./routes/esperaUvaRoutes");
    const recepcionUvaRoutes = require("./routes/recepcionUvaRoutes");
    const gasificadoUvaRoutes = require("./routes/gasificadoUvaRoutes");
    const frioUvaRoutes = require("./routes/frioUvaRoutes");
    const ordenesUvaRoutes = require("./routes/ordenesUvaRoutes");
    const gasificadoPreUvaRoutes = require("./routes/gasificado_pre_uvaRoutes");
    const frioUvaDerRoutes = require("./routes/frio_uva_derRoutes");

    // Registrar rutas ARÁNDANOS
    app.use("/api/ordenes", ordenesRoutes);
    app.use("/api/gasificado_pre", gasificadoPreRoutes);
    app.use("/api/espera", esperaRoutes);
    app.use("/api/recepcion", recepcionRoutes);
    app.use("/api/frio", frioRoutes);
    app.use("/api/gasificado_pre_aran", segundaTablaRoutes);
    app.use("/api/frio_arandano", frioArandano);

    // Registrar rutas UVA
    app.use("/api/recepcion_uva", recepcionUvaRoutes);
    app.use("/api/gasificado_uva", gasificadoUvaRoutes);
    app.use("/api/espera_uva", esperaUvaRoutes);
    app.use("/api/frio_uva", frioUvaRoutes);
    app.use("/api/ordenes_uva", ordenesUvaRoutes);
    app.use("/api/gasificado_pre_uva", gasificadoPreUvaRoutes);
    app.use("/api/frio_uva_der", frioUvaDerRoutes);

    // Iniciar el servidor escuchando en todas las IPs

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
    console.error("❌ Error conectando a la base de datos:", error);
  });
