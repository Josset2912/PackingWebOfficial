// routes/gasificadoPreAranRoutes.js
const express = require("express");
const router = express.Router();
const {
  getFrioArandano,
  addOrden,
} = require("../controllers/frio_arandanoController");

router.get("/", getFrioArandano);
router.post("/", addOrden);

module.exports = router;
