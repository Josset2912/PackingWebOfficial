const express = require("express");
const router = express.Router();
const { getOrdenesara } = require("../controllers/ordenesPTAranController");
console.log("📌 Cargando rutas de Ordenesara..."); // <-- Debu
// g
router.get("/", (req, res) => {
  getOrdenesara(req, res);
});

module.exports = router;
