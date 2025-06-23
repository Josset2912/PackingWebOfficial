const express = require("express");
const router = express.Router();
const { getFrioUva } = require("../controllers/frioUvaController"); // ✅ Asegúrate de que el import es correcto

router.get("/", getFrioUva); // ✅ Define la ruta correctamente

module.exports = router;
