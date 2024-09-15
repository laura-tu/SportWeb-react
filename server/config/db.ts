const mongoose = require("mongoose");

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://xbrejcakova:chobotnica78@cluster0.hpucx24.mongodb.net/"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};
