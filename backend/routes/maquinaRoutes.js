const { getMaquina } = require("../controllers/maquinaController.js"); // AJUSTA la ruta según tu proyecto
const express = require("express");

const router = express.Router();
router.get("/", getMaquina);

module.exports = router;
