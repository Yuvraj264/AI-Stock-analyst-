import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Establishes connection to the MongoDB instance using Mongoose.
 * Binds lifecycle listeners and handles initial error cases.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Initial connection failed: ${error.message}`);
    // Terminate server process on initial database connection failure
    process.exit(1);
  }
};

// Monitor ongoing connection events
mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Connection interrupted: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] MongoDB connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB connection reestablished.');
});

// Graceful shutdown helper
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[Database] MongoDB connection closed gracefully.');
  } catch (error) {
    console.error(`[Database Error] Error during graceful shutdown: ${error.message}`);
  }
};
