require("dotenv").config();

const express = require("express");
const cors = require("cors");
const compression = require("compression");

const connectDB = require("./config/db");
const log = require("./middleware/requestLogger");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const entryRoutes = require("./routes/entryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(log);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/entry", entryRoutes);
app.use("/api/product", productRoutes);

//test route
app.get("/", (req, res) => {
  res.send("LedgerMate API is running...");
});

module.exports = app;
