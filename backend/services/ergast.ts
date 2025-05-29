import axios from "axios";
import { Season } from "../models/season-model.ts";
import { Race } from "../models/race-model.ts";
import * as dotenv from "dotenv";
import pLimit from "p-limit";

dotenv.config();

const currentYear = new Date().getFullYear();
const baseURL = process.env.ERGAST_API;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Limit concurrency to 1 request at a time
const limit = pLimit(1);

const fetchWithRetry = async (url: string, retries = 5, delayMs = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url);
        } catch (err: any) {
            if (err.response?.status === 429) {
                console.warn(`429 Too Many Requests – retrying in ${delayMs}ms...`);
                await delay(delayMs + Math.random() * 300);
                delayMs *= 2;
            } else {
                throw err;
            }
        }
    }
    throw new Error(`Max retries reached for: ${url}`);
};

const runWithDelay = async <T>(
    tasks: (() => Promise<T>)[],
    delayMs: number
): Promise<PromiseSettledResult<T>[]> => {
    const results: PromiseSettledResult<T>[] = [];

    for (const task of tasks) {
        const result = await task().then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
        );
        results.push(result as PromiseSettledResult<T>);
        await delay(delayMs);
    }

    return results;
};

// Fetch and store seasons from 2005
export const fetchAndStoreSeasons = async () => {
    const { data } = await limit(() => fetchWithRetry(`${baseURL}/seasons.json?limit=1000`));
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

// Fetch and store races for filtered seasons with delay and allSettled handling
export const fetchAndStoreRaces = async () => {
    const seasons = await Season.find({
        season: { $gte: "2005", $lte: currentYear.toString() },
    });

    for (const seasonObj of seasons) {
        const { season } = seasonObj;

        try {
            const { data } = await limit(() => fetchWithRetry(`${baseURL}/${season}.json`));
            const races = data.MRData.RaceTable.Races;

            const raceTasks = races.map((r: { season: string; round: number; raceName: string; date: string; time?: string; Circuit: { circuitId: string; circuitName: string; }; }) => async () => {
                const raceDetails = await limit(() =>
                    fetchWithRetry(`${baseURL}/${season}/${r.round}/results.json`)
                );

                const results =
                    raceDetails.data.MRData.RaceTable.Races[0]?.Results ?? [];

                const mappedResults = results.map((res: any) => ({
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
                }));

                await Race.findOneAndUpdate(
                    { season: r.season, round: r.round },
                    {
                        season: r.season,
                        round: r.round.toString(),
                        raceName: r.raceName,
                        date: r.date,
                        time: r.time,
                        circuit: {
                            circuitId: r.Circuit.circuitId,
                            circuitName: r.Circuit.circuitName,
                        },
                        results: mappedResults,
                    },
                    { upsert: true, new: true }
                );
            });

            // Run all race tasks with 2s delay between each to spread requests
            const raceResults = await runWithDelay(raceTasks, 2000);

            const successful = raceResults.filter(r => r.status === "fulfilled").length;
            const failed = raceResults.filter(r => r.status === "rejected").length;

            await Season.updateOne({ season }, { rounds: races.length });

            console.log(
                `${races.length} rounds in the ${season} — Success: ${successful}, Failed: ${failed}`
            );
            console.log(`Races stored for season ${season}`);
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error processing season ${season}:`, err.message);
            } else {
                console.error(`Error processing season ${season}:`, err);
            }
        }
    }
};

// Fetch and store champions
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
