import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows DNS resolution with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vclt';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error with primary URI: ${error.message}`);
    try {
      console.log('🔄 Attempting local MongoDB connection (mongodb://127.0.0.1:27017/vclt)...');
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/vclt', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ Connected to Local MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (localError) {
      console.error(`❌ Local MongoDB connection failed: ${localError.message}`);
      console.log('⚠️ Running in disconnected database state until MongoDB is reachable.');
    }
  }
};
