const mongoose = require("mongoose");

const connectDatabase = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to server/.env.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
};

module.exports = connectDatabase;
