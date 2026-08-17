require("dotenv").config();

const firebase = require("./config/firebase");
console.log("Firebase Admin initialized successfully");

const express = require("express");
const cors = require("cors");
const compression = require("compression");

const connectDB = require("./config/db");

const log = require("./middleware/requestLogger");

const { globalRateLimiter } = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const entryRoutes = require("./routes/entryRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(log);
app.use(globalRateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/entry", entryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notification", notificationRoutes);

//test route
app.get("/", (req, res) => {
  res.send("LedgerMate API is running...");
});

module.exports = app;
