// Import Mongoose
const mongoose = require('mongoose');

// Define the connection function
const connectDB = async () => {
  try {
    // Use the environment variable for the URI
    const conn = await mongoose.connect("mongodb://localhost:27017/");
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
