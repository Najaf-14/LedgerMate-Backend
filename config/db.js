const dns = require("dns");
const mongoose = require("mongoose");

// Force reliable DNS resolvers before doing SRV lookups
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB Connection failed");
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
