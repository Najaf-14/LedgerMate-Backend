const express = require("express");
const app = express();

const env = require("dotenv").config();
const cors = require("cors");

//! Routes
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
  console.log(`Server running on PORT: ${PORT}`);
});
