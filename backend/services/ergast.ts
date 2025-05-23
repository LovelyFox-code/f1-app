import axios from "axios";
import { Driver, Race, Season } from "../models/index.ts";
import * as dotenv from "dotenv";

dotenv.config();

const currentYear = new Date().getFullYear();
const baseURL = process.env.ERGAST_API

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Fetch and store seasons from 2005
export const fetchAndStoreSeasons = async () => {
    const { data } = await axios.get(`${baseURL}/seasons.json?limit=1000`);
    const seasons = data.MRData.SeasonTable.Seasons;

    const filteredSeasons = seasons.filter(
        (s: any) => Number(s.season) >= 2005 && Number(s.season) <= currentYear
    );
    // await Season.deleteMany({ season: { $lt: "2005" } });
    for (const s of filteredSeasons) {
        await Season.findOneAndUpdate(
            { season: s.season },
            {
                season: s.season,
            },
            { upsert: true, new: true }
        );
    }
    console.log("Seasons stored");
};

export const fetchAndStoreDriver = async () => {
    try {
        const { data } = await axios.get(`${baseURL}/drivers.json?limit=1000`);
        const drivers = data.MRData.DriverTable.Drivers;

        for (const d of drivers) {
            await Driver.findOneAndUpdate(
                { driverId: d.driverId },
                {
                    driverId: d.driverId,
                    givenName: d.givenName,
                    familyName: d.familyName,
                    nationality: d.nationality,
                    dateOfBirth: d.dateOfBirth,
                    url: d.url,
                },
                { upsert: true, new: true }
            );
        }

        console.log("Drivers stored");
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error fetching drivers:", err.message);
        } else {
            console.error("Unknown error fetching drivers:", err);
        }
    }
};

// Fetch and store races for filtered seasons
export const fetchAndStoreRaces = async () => {
    const seasons = await Season.find({
        season: { $gte: "2005", $lte: currentYear.toString() },
    });

    for (const seasonObj of seasons) {
        const { season } = seasonObj;

        try {
            const { data } = await axios.get(`${baseURL}/${season}.json`);
            const races = data.MRData.RaceTable.Races;
            const rounds = races.length;
            for (const r of races) {
                await delay(300);
                const raceDetails = await axios.get(
                    `${baseURL}/${season}/${r.round}/results.json`
                );
                const results = raceDetails.data.MRData.RaceTable.Races[0]?.Results ?? [];
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

                    constructor: {
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
            }
            if (races) {
                await delay(300);
                await Season.updateOne(
                    { season },
                    {
                        rounds: rounds
                    }
                );
                console.log(`Rounds in the  ${season}`);
                console.log(`ROUNDS: ${rounds}`)
            } else {
                console.warn(`No champion data for season ${season}`);
            }

            await Season.updateOne({ season }, { rounds: races.length });
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
            const championRes = await axios.get(
                `https://api.jolpi.ca/ergast/f1/${season}/driverstandings/1.json`
            );

            const standingsList = championRes.data.MRData.StandingsTable.StandingsLists[0];
            const driver = standingsList?.DriverStandings[0]?.Driver;
            const constructor = standingsList?.DriverStandings[0]?.Constructors[0];

            if (driver && constructor) {
                await delay(300);
                await Season.updateOne(
                    { season },
                    {
                        champion: {
                            givenName: driver.givenName,
                            familyName: driver.familyName,
                            nationality: driver.nationality,
                            constructor: constructor.name,
                        },
                    }
                );
                console.log(`Champion stored for season ${season}`);
                console.log(`CONSTRUCTOR: ${constructor.name}`)
            } else {
                console.warn(`No champion data for season ${season}`);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Failed to fetch/store champion for season ${season}:`, err.message);
            } else {
                console.error(`Failed to fetch/store champion for season ${season}:`, err);
            }
        }
    }
};
