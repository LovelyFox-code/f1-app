import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
    try {
        mongoose.set("bufferCommands", false);

        await mongoose.connect(process.env.MONGODB_URI as string, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("MongoDB connection successful");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};

testConnection();
