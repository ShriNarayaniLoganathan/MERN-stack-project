const Ride = require("../models/Ride");
const drivers = require("../data/drivers");
const { calculateFare, getStatusMeta } = require("../utils/fare");

const assignDriver = (cabType) => {
  const matchingDrivers = drivers.filter((driver) => driver.cabType === cabType);
  const pool = matchingDrivers.length ? matchingDrivers : drivers;
  return pool[Math.floor(Math.random() * pool.length)];
};

const estimateRide = async (req, res, next) => {
  try {
    const { cabType, distanceKm } = req.body;

    if (!cabType || !distanceKm) {
      return res.status(400).json({ message: "Cab type and distance are required." });
    }

    const fare = calculateFare({
      cabType,
      distanceKm: Number(distanceKm),
    });

    res.json(fare);
  } catch (error) {
    next(error);
  }
};

const bookRide = async (req, res, next) => {
  try {
    const { pickup, dropoff, cabType, distanceKm, bookedFor } = req.body;

    if (!pickup?.address || !dropoff?.address || !cabType || !distanceKm) {
      return res.status(400).json({
        message: "Pickup, dropoff, cab type, and distance are required.",
      });
    }

    const fare = calculateFare({
      cabType,
      distanceKm: Number(distanceKm),
    });
    const driver = assignDriver(cabType);
    const status = "driver_assigned";
    const liveLocation = getStatusMeta(status);

    const ride = await Ride.create({
      user: req.user._id,
      pickup,
      dropoff,
      cabType,
      distanceKm: Number(distanceKm),
      estimatedFare: fare.estimatedFare,
      finalFare: fare.estimatedFare,
      bookedFor: bookedFor || new Date(),
      status,
      driver,
      liveLocation,
    });

    res.status(201).json({
      ride,
      fareBreakdown: fare.fareBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

const getUserRides = async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId;

    if (requestedUserId && requestedUserId !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only view your own rides." });
    }

    const rides = await Ride.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    next(error);
  }
};

const updateRideStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const ride = await Ride.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found." });
    }

    ride.status = status;
    ride.liveLocation = getStatusMeta(status);

    if (status === "completed") {
      ride.finalFare = ride.estimatedFare;
    }

    await ride.save();

    res.json(ride);
  } catch (error) {
    next(error);
  }
};

const deleteRide = async (req, res, next) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found." });
    }

    await ride.deleteOne();

    res.json({ message: "Ride deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  estimateRide,
  bookRide,
  getUserRides,
  updateRideStatus,
  deleteRide,
};
