const express = require("express");
const { getFrioUvaDer,addOrden} = require("../controllers/frio_uva_derController"); // Asegúrate que el nombre del archivo sea exacto

const router = express.Router();

router.get("/", getFrioUvaDer);
router.post("/add", addOrden); // Cambiado a POST para agregar una nueva orden

module.exports = router;
