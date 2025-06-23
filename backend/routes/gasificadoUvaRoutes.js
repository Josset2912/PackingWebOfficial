const express = require("express");
const {
  getGasificadoUva,
  addOrden,
} = require("../controllers/gasificadoUvaController"); // 🔥 Verifica que el nombre sea correcto

const router = express.Router();

router.get("/", getGasificadoUva); // 🔥 Asegúrate de que esta función existe
router.post("/", addOrden); // 🔥 Asegúrate de que esta función existe

module.exports = router;
