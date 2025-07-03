const { getTurno } = require("../controllers/turnoController.js"); // AJUSTA la ruta según tu proyecto
const express = require("express");

const router = express.Router();
router.get("/", getTurno);

module.exports = router;
