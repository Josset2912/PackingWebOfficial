const express = require("express");
const { getGasificadoBatchPre } = require("../controllers/gasificadoBatchPreAranController"); // 🔥 Verifica que el nombre sea correcto

const router = express.Router();

router.get("/", getGasificadoBatchPre); // 🔥 Asegúrate de que esta función existe

module.exports = router;
