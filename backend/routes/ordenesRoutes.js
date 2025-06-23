const express = require("express");
const { getOrdenes, addOrden } = require("../controllers/ordenesController");

const router = express.Router();

router.get("/", getOrdenes);
router.post("/", addOrden);

module.exports = router;
