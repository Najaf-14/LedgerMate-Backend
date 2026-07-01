const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

router.get("/signup", signup);
router.get("/login", login);

module.exports = router;
