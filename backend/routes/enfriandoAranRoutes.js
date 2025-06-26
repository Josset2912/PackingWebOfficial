const express = require("express");
const {
  getEnfriandoArandano,
} = require("../controllers/enfriandoAranController");

//console.log("📌 Cargando rutas de Recepción..."); // <-- Debug

const router = express.Router();

router.get("/", (req, res) => {
  getEnfriandoArandano(req, res);
});

module.exports = router;
