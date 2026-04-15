const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: String,
    cabType: String,
    vehicle: String,
    plateNumber: String,
    rating: Number,
    phone: String,
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickup: {
      type: locationSchema,
      required: true,
    },
    dropoff: {
      type: locationSchema,
      required: true,
    },
    cabType: {
      type: String,
      enum: ["Mini", "Sedan", "SUV"],
      required: true,
    },
    distanceKm: {
      type: Number,
      required: true,
      min: 1,
    },
    estimatedFare: {
      type: Number,
      required: true,
    },
    finalFare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "booked",
        "driver_assigned",
        "on_the_way",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "booked",
    },
    driver: driverSchema,
    liveLocation: {
      label: {
        type: String,
        default: "Driver assigned",
      },
      progress: {
        type: Number,
        default: 10,
      },
    },
    bookedFor: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ride", rideSchema);
