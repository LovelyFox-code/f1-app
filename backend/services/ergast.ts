import axios from "axios";
import { Circuit, Constructor, Driver, Race, Season } from "../models/index.ts";

// Fetch and store drivers
export const fetchAndStoreDrivers = async () => {
    const { data } = await axios.get("https://ergast.com/api/f1/drivers.json?limit=1000");;
    const drivers = data.MRData.DriverTable.Drivers;

    for (const d of drivers) {
        await Driver.findOneAndUpdate(
            { driverId: d.driverId },
            {
                driverId: d.driverId,
                givenName: d.givenName,
                familyName: d.familyName,
                dateOfBirth: d.dateOfBirth,
                nationality: d.nationality,
                url: d.url,
                code: d.code ?? null,
                permanentNumber: d.permanentNumber ?? null,
            },
            { upsert: true, new: true }
        );
    }

    console.log("Drivers stored");
};

// Fetch and store constructors
export const fetchAndStoreConstructors = async () => {
    const { data } = await axios.get("https://ergast.com/api/f1/constructors.json?limit=1000");
    const constructors = data.MRData.ConstructorTable.Constructors;

    for (const c of constructors) {
        await Constructor.findOneAndUpdate(
            { constructorId: c.constructorId },
            {
                constructorId: c.constructorId,
                name: c.name,
                nationality: c.nationality,
                url: c.url,
            },
            { upsert: true, new: true }
        );
    }

    console.log("Constructors stored");
};

// Fetch and store circuits
export const fetchAndStoreCircuits = async () => {
    const { data } = await axios.get("https://ergast.com/api/f1/circuits.json?limit=1000");
    const circuits = data.MRData.CircuitTable.Circuits;

    for (const c of circuits) {
        await Circuit.findOneAndUpdate(
            { circuitId: c.circuitId },
            {
                circuitId: c.circuitId,
                url: c.url,
                circuitName: c.circuitName,
                location: {
                    lat: c.Location.lat,
                    long: c.Location.long,
                    locality: c.Location.locality,
                    country: c.Location.country,
                },
            },
            { upsert: true, new: true }
        );
    }

    console.log("Circuits stored");
};

// Fetch and store seasons
export const fetchAndStoreSeasons = async () => {
    const { data } = await axios.get("https://ergast.com/api/f1/seasons.json?limit=1000");
    const seasons = data.MRData.SeasonTable.Seasons;

    for (const s of seasons) {
        await Season.findOneAndUpdate(
            { season: s.season },
            {
                season: s.season,
                rounds: 0,
            },
            { upsert: true, new: true }
        );
    }

    console.log("Seasons stored");
};

// Fetch and store races for all seasons
export const fetchAndStoreRaces = async () => {
    const seasons = await Season.find();
    const currentYear = new Date().getFullYear();
    const filteredSeasons = seasons.filter(
        (s: any) => Number(s.season) >= 2005 && Number(s.season) <= currentYear
    );

    for (const seasonObj of filteredSeasons) {
        const { season } = seasonObj;
        const { data } = await axios.get(`https://ergast.com/api/f1/${season}.json`);
        const races = data.MRData.RaceTable.Races;

        for (const r of races) {
            const circuit = await Circuit.findOne({ circuitId: r.Circuit.circuitId });

            await Race.findOneAndUpdate(
                { season: r.season, round: r.round },
                {
                    season: r.season,
                    round: Number(r.round),
                    raceName: r.raceName,
                    date: r.date,
                    time: r.time,
                    circuit: circuit?._id,
                },
                { upsert: true, new: true }
            );
        }

        await Season.updateOne({ season }, { rounds: races.length });
        console.log(`Races stored for season ${season}`);
    }
};
