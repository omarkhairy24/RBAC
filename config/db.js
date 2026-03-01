const mongoose = require("mongoose");

let dbConnection;

const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  if (dbConnection) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URL);
    dbConnection = db.connection;
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const closeConnection = () => {
  if (dbConnection) {
    dbConnection.close();
    console.log('MongoDB connection closed');

  }
};

process.on("SIGINT", closeConnection);
process.on("SIGTERM", closeConnection);

module.exports = connectDB;