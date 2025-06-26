// routes/gasificadoPreAranRoutes.js
const express = require("express");
const router = express.Router();
const {
  getGasificadoBatchPreFrioAran
  
} = require("../controllers/gasificado_BatchpreFrioAranController");

router.get("/", getGasificadoBatchPreFrioAran);
//router.post("/", addOrden); // Ruta para agregar una orden

module.exports = router;
