const { getCultivo } = require("../controllers/cultivoController.js"); // AJUSTA la ruta según tu proyecto
const express = require("express");

const router = express.Router();
router.get("/", getCultivo);

module.exports = router;
