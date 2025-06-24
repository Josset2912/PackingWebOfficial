// routes/gasificadoPreAranRoutes.js
const express = require("express");
const {
  getGasificadoPreAran,
  addOrden,
} = require("../controllers/gasificado_pre_aranController");

const router = express.Router();

router.get("/", getGasificadoPreAran);
//router.post("/", addOrden); // Ruta para agregar una orden

module.exports = router;
