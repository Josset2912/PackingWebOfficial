// routes/gasificadoPreAranRoutes.js
const express = require("express");
const router = express.Router();
const {
  getGasificadoPreFrioAran
  
} = require("../controllers/gasificado_preFrioAranController");

router.get("/", getGasificadoPreFrioAran);
//router.post("/", addOrden); // Ruta para agregar una orden

module.exports = router;
