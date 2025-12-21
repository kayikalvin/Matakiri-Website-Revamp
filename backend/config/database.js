const mongoose = require('mongoose');

const connectDB = async () => {
  const primary = process.env.MONGODB_URI;
  const fallback = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/matakiri';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (!primary) {
    console.warn('No MONGODB_URI set; attempting local MongoDB...');
  }

  try {
    const conn = await mongoose.connect(primary || fallback, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.error('Primary DB connection error:', error.message || error);

    // Try fallback local DB
    try {
      console.log(`Attempting fallback MongoDB at ${fallback}`);
      const conn2 = await mongoose.connect(fallback, options);
      console.log(`MongoDB Connected (fallback): ${conn2.connection.host}`);
      return;
    } catch (err2) {
      console.error('Fallback DB connection error:', err2.message || err2);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
