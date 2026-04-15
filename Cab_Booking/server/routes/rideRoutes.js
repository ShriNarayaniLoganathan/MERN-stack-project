console.log("Ride routes loaded 🚀");

const express = require("express");
const Ride = require("../models/Ride");
const router = express.Router();
const auth = require("../middleware/auth");

// GET all rides
router.get("/",auth, async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST ride
router.post("/",auth, async (req, res) => {
  try {
    const { pickup, drop } = req.body;

    const ride = new Ride({ pickup, drop });
    await ride.save();

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 DELETE route (IMPORTANT)
router.delete("/:id",auth, async (req, res) => {
  console.log("DELETE HIT ✅", req.params.id);

  try {
    const deleted = await Ride.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json({ message: "Ride deleted" });
  } catch (error) {
    console.log("DELETE ERROR ❌", error);
    res.status(500).json({ message: error.message });
  }
});

//EDIT: Added DELETE route for ride deletion
router.put("/:id",auth,async(req,res) => {
  try{
    const {pickup,drop} = req.body;
    const updateRide = await Ride.findByIdAndUpdate(
      req.params.id,
      {pickup,drop},
      {new: true}
    );
    res.json(updateRide);
  }catch (error){
    res.status(500).json({message: error.message});
  }
  });

module.exports = router;