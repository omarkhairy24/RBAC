const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes/index');
app.use("/api", routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Error on starting server:', error);
    process.exit(1);
  }
});

const errorMiddleWare = require('./common/middleware/error.middleware');
app.use(errorMiddleWare);