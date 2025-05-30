import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongod: MongoMemoryServer;

// Increase timeout for MongoDB setup
jest.setTimeout(30000);

// Connect to the in-memory database before running tests
beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'jest',
        port: 0
      }
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
    throw error;
  }
});

// Clear all test data after each test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing collections:', error);
  }
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  } catch (error) {
    console.error('Error cleaning up MongoDB:', error);
  }
}); 