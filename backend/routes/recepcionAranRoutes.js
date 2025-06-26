const { getRecepcion } = require("../controllers/recepcionAranController");
const express = require("express");

console.log("📌 Cargando rutas de Recepción..."); // <-- Debug

const router = express.Router();
router.get("/", (req, res) => {
  getRecepcion(req, res);
});

module.exports = router;
