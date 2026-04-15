const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  estimateRide,
  bookRide,
  getUserRides,
  updateRideStatus,
  deleteRide,
} = require("../controllers/rideController");

const router = express.Router();

router.post("/estimate", estimateRide);
router.post("/book", authMiddleware, bookRide);
router.get("/my-rides", authMiddleware, getUserRides);
router.get("/:userId", authMiddleware, getUserRides);
router.put("/:id/status", authMiddleware, updateRideStatus);
router.delete("/:id", authMiddleware, deleteRide);

module.exports = router;
