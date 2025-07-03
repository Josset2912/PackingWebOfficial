const { getSede } = require("../controllers/sedeController.js"); // AJUSTA la ruta según tu proyecto
const express = require("express");

const router = express.Router();
router.get("/", getSede);

module.exports = router;
