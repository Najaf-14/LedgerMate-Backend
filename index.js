const express = require("express");
const app = express();

const env = require("dotenv").config();
const cors = require("cors");

//! Routes
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

connectDB();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;
app.listen(PORT || "0.0.0.0", (req, res) => {
  console.log(`Server running on PORT: ${PORT}`);
});
