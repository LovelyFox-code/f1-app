import { Season } from "../models/season-model.ts";
import { delay, fetchWithRetry } from "../utils/api-utils.ts";
import * as dotenv from "dotenv";
import pLimit from "p-limit";

dotenv.config();

const currentYear = new Date().getFullYear();
const baseURL = process.env.ERGAST_API;
const limit = pLimit(1);

export const fetchAndStoreChampions = async () => {
    const seasons = await Season.find({
        season: { $gte: "2005", $lte: currentYear.toString() },
    });

    for (const seasonObj of seasons) {
        const { season } = seasonObj;

        try {
            const championRes = await limit(() =>
                fetchWithRetry(`${baseURL}/${season}/driverstandings/1.json`)
            );

            const standingsList =
                championRes.data.MRData.StandingsTable.StandingsLists[0];
            const driver = standingsList?.DriverStandings[0]?.Driver;
            const constructor = standingsList?.DriverStandings[0]?.Constructors[0];

            if (driver && constructor) {
                await delay(1000);
                await Season.updateOne(
                    { season },
                    {
                        champion: {
                            givenName: driver.givenName,
                            familyName: driver.familyName,
                            nationality: driver.nationality,
                            constructorName: constructor.name,
                        },
                    }
                );
                console.log(`Champion stored for season ${season}`);
            } else {
                console.warn(`No champion data for season ${season}`);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(
                    `Failed to fetch/store champion for season ${season}:`,
                    err.message
                );
            } else {
                console.error(`Failed to fetch/store champion for season ${season}:`, err);
            }
        }
    }
}; 