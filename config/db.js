const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log("MondoDB connected successfully");
  } catch (error) {
    console.log("MondoDB Connectoin failed");
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
