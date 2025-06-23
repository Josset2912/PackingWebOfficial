const express = require("express");
const { getEsperaUva } = require("../controllers/esperaUvaController");

const router = express.Router();

router.get("/", getEsperaUva); // 🔥 Debe coincidir con lo que busca el frontend

module.exports = router;
