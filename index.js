const env = require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const compression = require("compression");
const connectDB = require("./config/db");
const log = require("./middleware/requestLogger");

//* Routes
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const entryRoutes = require("./routes/entryRoutes");
const productRoutes = require("./routes/productRoutes");

//* Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(compression());
app.use(log);

connectDB();

// Apis
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/entry", entryRoutes);
app.use("/api/product", productRoutes);

const PORT = process.env.PORT;
app.listen(PORT || "0.0.0.0", (req, res) => {
  console.log(`Server running on PORT: ${PORT}`);
});
