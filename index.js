const express = require("express");
const app = express();

const env = require("dotenv").config();
const cors = require("cors");
const compression = require("compression");

//! Routes
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const entryRoutes = require("./routes/entryRoutes")

const log = require("./middleware/requestLogger");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(compression());

// log middleware
app.use(log);

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/entry", entryRoutes);

const PORT = process.env.PORT;
app.listen(PORT || "0.0.0.0", (req, res) => {
  console.log(`Server running on PORT: ${PORT}`);
});
