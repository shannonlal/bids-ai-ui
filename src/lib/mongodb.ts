import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const globalWithMongoose = global as typeof global & {
  mongooseConnection: typeof mongoose | null;
};

if (!globalWithMongoose.mongooseConnection) {
  globalWithMongoose.mongooseConnection = null;
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGO_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
  }

  if (globalWithMongoose.mongooseConnection) {
    return globalWithMongoose.mongooseConnection;
  }

  try {
    const mongooseInstance = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    globalWithMongoose.mongooseConnection = mongooseInstance;

    // Handle cleanup on app termination
    process.on('beforeExit', async () => {
      if (globalWithMongoose.mongooseConnection) {
        await globalWithMongoose.mongooseConnection.disconnect();
        globalWithMongoose.mongooseConnection = null;
      }
    });

    return mongooseInstance;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectDB;
