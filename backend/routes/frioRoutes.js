const express = require("express");
const router = express.Router();
const { getFrioData, addOrden } = require("../controllers/frioController"); // ✅ Asegúrate de que el import es correcto

router.get("/", getFrioData); // ✅ Define la ruta correctamente
router.post("/add", addOrden); // ✅ Define la ruta correctamente

module.exports = router;
