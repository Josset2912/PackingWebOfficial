const express = require("express");
const { getEspera } = require("../controllers/esperaController");

const router = express.Router();

router.get("/", getEspera); // 🔥 Debe coincidir con lo que busca el frontend

module.exports = router;
