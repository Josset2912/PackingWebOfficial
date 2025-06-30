const { getAvanceLinea } = require("../controllers/avanceLineaController");
const express = require("express");

console.log("📌 Cargando rutas de Recepción..."); // <-- Debug

const router = express.Router();
router.get("/", getAvanceLinea);

module.exports = router;
