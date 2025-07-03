const {
  getRecepcionNisira,
} = require("../controllers/recepcionNisiraAranController.js");
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  getRecepcionNisira(req, res);
});
module.exports = router;
