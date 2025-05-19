import mongoose from "mongoose";
import dotenv from "dotenv";

import {
    fetchAndStoreDrivers,
    fetchAndStoreConstructors,
    fetchAndStoreCircuits,
    fetchAndStoreSeasons,
    fetchAndStoreRaces,
} from "../services/ergast.ts";
import { Circuit, Constructor, Driver, Race, Season } from "../models/index.ts";

dotenv.config();
const importData = async () => {
    await fetchAndStoreDrivers();
    await fetchAndStoreConstructors();
    await fetchAndStoreCircuits();
    await fetchAndStoreSeasons();
    await fetchAndStoreRaces();
    console.log("Seeding complete");
};
const destroyData = async () => {
    await Driver.deleteMany({});
    await Constructor.deleteMany({});
    await Circuit.deleteMany({});
    await Season.deleteMany({});
    await Race.deleteMany({});
    console.log("Data destroyed");
};


const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("🚀 Connected to MongoDB");

        if (process.argv[2] === "-d") {
            await destroyData();
        } else {
            await importData();
        }
        console.log("Seeding complete");
    } catch (err) {
        console.error("Error during seeding", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

runSeeder();
