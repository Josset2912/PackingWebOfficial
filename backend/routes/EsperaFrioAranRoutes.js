const { getFrio } = require("../controllers/EsperaFrioAranController");
const express = require("express");

//console.log("📌 Cargando rutas de Recepción..."); // <-- Debug

const router = express.Router();

router.get("/", (req, res) => {
  getFrio(req, res);
});

module.exports = router;
