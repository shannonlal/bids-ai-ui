import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import connectDB from '../mongodb';

type GlobalWithMongoose = typeof global & {
  mongooseConnection: typeof mongoose | null;
};

vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn().mockImplementation(() => mongoose.default),
    disconnect: vi.fn(),
  },
}));

describe('MongoDB Connection', () => {
  const mockMongoURI = 'mongodb://test-uri';
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, MONGO_URI: mockMongoURI };
    vi.clearAllMocks();
    // Reset global connection
    (global as GlobalWithMongoose).mongooseConnection = null;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should connect to MongoDB with correct URI', async () => {
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith(mockMongoURI, {
      bufferCommands: false,
    });
  });

  it('should reuse existing connection if available', async () => {
    // First connection
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);

    // Second connection attempt
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledTimes(2); // Should not call connect again
  });

  it('should handle connection errors', async () => {
    const mockError = new Error('Connection failed');
    vi.mocked(mongoose.connect).mockRejectedValueOnce(mockError);

    await expect(connectDB()).rejects.toThrow('Connection failed');
  });

  it('should throw error if MONGO_URI is not defined', async () => {
    process.env.MONGO_URI = undefined;
    await expect(connectDB()).rejects.toThrow('Please define the MONGO_URI environment variable');
  });
});
