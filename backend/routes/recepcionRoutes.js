const express = require("express");
const router = express.Router();
const { getRecepcion } = require("../controllers/recepcionController");

console.log("📌 Cargando rutas de Recepción..."); // <-- Debug

router.get("/", (req, res) => {
  getRecepcion(req, res);
});

module.exports = router;
