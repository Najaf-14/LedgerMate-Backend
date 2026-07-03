const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createBusiness,
  getBusiness,
  updateBusiness,
} = require("../controllers/businessController");

router.use(authMiddleware);

router.post("/", createBusiness);
router.get("/", getBusiness);
router.put("/", updateBusiness);

module.exports = router;
