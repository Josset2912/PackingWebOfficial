const express = require("express");
const router = express.Router();
const { getOrdenesara } = require("../controllers/ordenesPTAranController");// <-- Debu
// g
router.get("/", (req, res) => {
  getOrdenesara(req, res);
});

module.exports = router;
