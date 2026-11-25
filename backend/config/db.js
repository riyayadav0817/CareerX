const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (process.env.NODE_ENV === 'production' && !uri) {
      throw new Error('MONGODB_URI environment variable is required in production');
    }
    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/careerx_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
