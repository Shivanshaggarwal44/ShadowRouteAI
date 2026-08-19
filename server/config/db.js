const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shadowroute_db';
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000 // Quick timeout to fall back to in-memory store if DB is down
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Connection warning: ${error.message}.`);
    console.log(`[ShadowRoute Engine] Operating with resilient mock data fallback mode.`);
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
