import app from "./app.ts";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT) || 5001;
const mongoUri = process.env.MONGODB_URI!;

const startServer = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connection successful");

        app.listen(port, "0.0.0.0", () => {
            const isRender = process.env.RENDER === 'true';
            const baseUrl = isRender
                ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
                : `http://localhost:${port}`;
            console.log(`Server is running on ${baseUrl}`);
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

startServer();