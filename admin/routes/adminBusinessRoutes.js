const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getAllBusinesses,
  getBusiness,
  changeBusinessMode,
  removeBusiness,
} = require("../controllers/adminBusinessController");

router.use(authMiddleware, adminMiddleware);

router.get("/", getAllBusinesses);
router.get("/:id", getBusiness);
router.patch("/:id/mode", changeBusinessMode);
router.delete("/:id", removeBusiness);

module.exports = router;
