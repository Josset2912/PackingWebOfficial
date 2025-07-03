// routes/gasificadoPreAranRoutes.js
const express = require("express");
const router = express.Router();
const {
  getEnfriandoBatch,
} = require("../controllers/frio_BatchEsperaEnfriandoAranController");

router.get("/", getEnfriandoBatch);
//router.post("/", addOrden); // Ruta para agregar una orden

module.exports = router;
