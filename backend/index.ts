import app from "./app.ts";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT ?? 5001;
const mongoUri = process.env.MONGODB_URI!;

const startServer = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connection successful");

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

startServer();