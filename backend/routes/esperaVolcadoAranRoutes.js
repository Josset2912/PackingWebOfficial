const { getEspera } = require("../controllers/esperaVolcadoAranController.js");
const express = require("express");

const router = express.Router();
router.get("/", (req, res) => {
  getEspera(req, res);
});

module.exports = router;
