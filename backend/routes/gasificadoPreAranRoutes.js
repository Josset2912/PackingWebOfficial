const express = require("express");
const { getGasificadoPre } = require("../controllers/gasificadoPreAranController"); // 🔥 Verifica que el nombre sea correcto

const router = express.Router();

router.get("/", getGasificadoPre); // 🔥 Asegúrate de que esta función existe

module.exports = router;
