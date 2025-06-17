import { Season } from "../models/season-model.ts";
import { fetchWithRetry } from "../utils/api-utils.ts";
import pLimit from "p-limit";
import * as dotenv from "dotenv";

dotenv.config();

const currentYear = new Date().getFullYear();
const baseURL = process.env.ERGAST_API;
// Using p-limit to control concurrency and prevent overwhelming the external API
const limit = pLimit(1);

export const fetchAndStoreSeasons = async () => {
    const { data } = await limit(() => fetchWithRetry(`${baseURL}/seasons.json?limit=100`));
    const seasons = data.MRData.SeasonTable.Seasons;

    const filteredSeasons = seasons.filter(
        (s: any) => Number(s.season) >= 2005 && Number(s.season) <= currentYear
    );

    for (const s of filteredSeasons) {
        await Season.findOneAndUpdate(
            { season: s.season },
            { season: s.season },
            { upsert: true, new: true }
        );
    }

    console.log("Seasons stored");
};

/**
 * Get all seasons from the database
 * @returns Array of seasons sorted by year in descending order
 */
export const getAllSeasons = async () => {
    const currentYear = new Date().getFullYear();
    return Season.find({
        season: { $gte: "2005", $lte: currentYear.toString() }
    }).sort({ season: -1 });
};

/**
 * Get a specific season by year
 * @param season The season year to find
 * @returns The season object or null if not found
 */
export const getSeasonByYear = async (season: string) => {
    return Season.findOne({ season });
};