const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  pickup: String,
  drop: String,
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);