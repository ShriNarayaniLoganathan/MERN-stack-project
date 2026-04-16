require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth",require("./routes/authRoutes"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Database connection failed:", err));

app.use("/api/rides", require("./routes/rideRoutes"));

app.get("/", (req, res) => {
  res.send("Cab Booking Backend Running 🚕");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port",PORT);
});