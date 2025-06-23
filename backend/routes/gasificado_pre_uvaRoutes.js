// routes/gasificadoPreAranRoutes.js
const express = require("express");
const {
  getGasificadoPreUva,
  addOrden,
} = require("../controllers/gasificado_pre_uvaController");

const router = express.Router();

router.get("/", getGasificadoPreUva);
router.post("/add", addOrden);

module.exports = router;
