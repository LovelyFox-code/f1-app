import { Race } from "../models/race-model.ts";
import { Season } from "../models/season-model.ts";
import { fetchPaginatedResults } from "../utils/api-utils.ts";
import pLimit from "p-limit";
import * as dotenv from "dotenv";

dotenv.config();

const currentYear = new Date().getFullYear();
const baseURL = process.env.ERGAST_API as string;
const limit = pLimit(1);

export const fetchAndStoreRaces = async () => {
    const seasons = await Season.find({
        season: { $gte: "2005", $lte: currentYear.toString() },
    });

    for (const seasonObj of seasons) {
        const { season } = seasonObj;

        try {
            const races = await limit(() =>
                fetchPaginatedResults({
                    baseUrl: baseURL,
                    season: season,
                    endpoint: "results",
                    limitPerPage: 100,
                })
            );
            if (!races || races.length === 0) {
                console.warn(`No races found for season ${season}`);
                continue;
            }

            const raceTasks = races.map((race: any) => limit(async () => {
                try {
                    const mappedResults = race.Results?.map((res: any) => ({
                        number: res.number,
                        position: res.position,
                        positionText: res.positionText,
                        points: res.points,
                        driver: {
                            driverId: res.Driver.driverId,
                            givenName: res.Driver.givenName,
                            familyName: res.Driver.familyName,
                            nationality: res.Driver.nationality,
                        },
                        constructorName: {
                            constructorId: res.Constructor.constructorId,
                            name: res.Constructor.name,
                            nationality: res.Constructor.nationality,
                        },
                    })) ?? [];

                    await Race.findOneAndUpdate(
                        { season: race.season, round: race.round },
                        {
                            season: race.season,
                            round: race.round.toString(),
                            raceName: race.raceName,
                            date: race.date,
                            time: race.time,
                            circuit: {
                                circuitId: race.Circuit.circuitId,
                                circuitName: race.Circuit.circuitName,
                            },
                            results: mappedResults,
                        },
                        { upsert: true, new: true }
                    );
                } catch (error) {
                    console.error(`Failed to store race ${race.round} of ${season}:`, error);
                }
            }));

            await Promise.all(raceTasks);

            // Update the season with the number of rounds. 
            // We cannot rely on the race.length, since there might be duplicates due to the paginated fetch.
            const maxRound = Math.max(...(races as any[]).map((r: any) => r.round));
            console.log(`Updating season ${season} with max round ${maxRound}`);
            await Season.updateOne({ season }, { rounds: maxRound });
        } catch (err) {
            console.error(`Error fetching races for season ${season}:`, err);
        }
    }
};
