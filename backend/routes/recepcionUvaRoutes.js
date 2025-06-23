const express = require("express");
const router = express.Router();
const { getRecepcionUva } = require("../controllers/recepcionUvaController");

router.get("/", (req, res) => {
  getRecepcionUva(req, res);
});

module.exports = router;
