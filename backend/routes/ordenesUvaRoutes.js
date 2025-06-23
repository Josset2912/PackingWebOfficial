const express = require("express");
const { getOrdenesUva, addOrdenUva } = require("../controllers/ordenesUvaController");

const router = express.Router();

router.get("/", getOrdenesUva);
router.post("/", addOrdenUva);

module.exports = router;
