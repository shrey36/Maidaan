const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment variables.');
      process.exit(1);
    }

    // Never log the full URI (contains credentials)
    console.log('Connecting to MongoDB...');

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB Connected Successfully!');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
