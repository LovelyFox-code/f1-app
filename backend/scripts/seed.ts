import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';

import {
    fetchAndStoreSeasons,
    fetchAndStoreRaces,
    fetchAndStoreChampions,
} from "../services/ergast.ts";
import { Driver, Race, Season } from "../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const importData = async () => {
    try {
        await fetchAndStoreSeasons();
        await fetchAndStoreRaces();
        await fetchAndStoreChampions()
        console.log("Seeding complete");
    } catch (error) {
        console.error("Error during data import:", error);
        throw error;
    }
};

const destroyData = async () => {
    try {
        await Driver.deleteMany({});
        await Season.deleteMany({});
        await Race.deleteMany({});
        console.log("Data destroyed");
    } catch (error) {
        console.error("Error during data destruction:", error);
        throw error;
    }
};

const runSeeder = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🚀 Connected to MongoDB");

        if (process.argv[2] === "-d") {
            await destroyData();
        } else {
            await importData();
        }
    } catch (err) {
        console.error("Error during seeding:", err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

runSeeder();
