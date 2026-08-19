const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getAllUsers,
  getSingleUser,
  changeUserRole,
  removeUser,
} = require("../controllers/adminUserController");

router.get("/", authMiddleware, adminMiddleware, getAllUsers);

router.get("/:id", authMiddleware, adminMiddleware, getSingleUser);

router.patch("/:id/role", authMiddleware, adminMiddleware, changeUserRole);

router.delete("/:id", authMiddleware, adminMiddleware, removeUser);

module.exports = router;
