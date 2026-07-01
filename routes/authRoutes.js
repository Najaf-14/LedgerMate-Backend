const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
