const { getRecepcion } = require("../controllers/recepcionAranController");
const express = require("express");

const router = express.Router();
router.get("/", (req, res) => {
  getRecepcion(req, res);
});

module.exports = router;
