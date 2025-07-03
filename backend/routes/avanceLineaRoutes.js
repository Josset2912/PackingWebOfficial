const { getAvanceLinea } = require("../controllers/avanceLineaController");
const express = require("express");



const router = express.Router();
router.get("/", getAvanceLinea);

module.exports = router;
