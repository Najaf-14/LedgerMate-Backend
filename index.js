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

//admin routes
const adminAuthRoutes = require("./admin/routes/adminAuthRoutes");
const adminRoutes = require("./admin/routes/adminRoutes");
const adminDashboardRoutes = require("./admin/routes/adminDashboardRoutes");
const adminBusinessRoutes = require("./admin/routes/adminBusinessRoutes");
const adminPaymentRoutes = require("./admin/routes/adminPaymentRoutes");
const adminReportRoutes = require("./admin/routes/adminReportRoutes");
const adminSettingsRoutes = require("./admin/routes/adminSettingsRoutes");

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

//admin apis
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/businesses", adminBusinessRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

//test route
app.get("/", (req, res) => {
  res.send("LedgerMate API is running...");
});

module.exports = app;
