const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async () => {
  const mongoUri = process.env.MONGO_URL || "mongodb://mongo:27017/SidhaReporting";

  try {
    await mongoose.connect(mongoUri, {
      dbName: "SidhaReporting",
    });
    console.log("Successfully Connected to the database");
  } catch (error) {
    console.error("Error in creating the database:", error.message);
  }
};

module.exports = dbConnection;