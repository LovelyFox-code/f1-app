import express from "express";
import cors from "cors";
import mockSeasons from "./mock-data/seasons.ts";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import mockRaces from "./mock-data/races.ts";
import mockDrivers from "./mock-data/drivers.ts";
import mockConstructors from "./mock-data/constructors.ts";
import mockResults from "./mock-data/results.ts";
import mockDriverStandings from "./mock-data/driver-standings.ts";
import mockConstructorStandings from "./mock-data/constructor-standings.ts";
import mockQualifying from "./mock-data/qualifying.ts";
import mockPitStops from "./mock-data/pitstops.ts";
import mockLaps from "./mock-data/laps.ts";
import mockStatus from "./mock-data/status.ts";

const app = express();

const __dirname = process.cwd() + "/backend/docs";

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

app.use(express.json());
app.use(cors());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
    res.send("API is running...");
});
app.get("/api/seasons", (_req, res) => {
    res.json(mockSeasons);
});
app.get("/api/seasons/:season", (req, res) => {
    const { season } = req.params;
    const foundSeason = mockSeasons.find((s) => s.season === season);
    if (foundSeason) {
        res.json(foundSeason);
    } else {
        res.status(404).json({ message: "Season not found" });
    }
});
// Races for a specific season
app.get("/api/:season/races", (req, res) => {
    const { season } = req.params;
    const races = mockRaces.filter((r) => r.season === season);
    res.json(races);
});

// All drivers for a season
app.get("/api/:season/drivers", ((req, res) => {
    const { season } = req.params;
    const drivers = mockDrivers.filter((d) => d.season === season);
    if (drivers.length === 0) {
        return res.status(404).json({ message: "No drivers found for this season" });
    }
    res.json(drivers);
}) as express.RequestHandler);

// All constructors for a season
app.get("/api/:season/constructors", (req, res) => {
    res.json(mockConstructors);
});

// Results for a specific race
app.get("/api/:season/:round/results", (req, res) => {
    res.json(mockResults);
});

// Driver standings
app.get("/api/:season/driver-standings", (req, res) => {
    res.json(mockDriverStandings);
});

// Constructor standings
app.get("/api/:season/constructor-standings", (req, res) => {
    res.json(mockConstructorStandings);
});

// Qualifying results
app.get("/api/:season/:round/qualifying", (req, res) => {
    res.json(mockQualifying);
});

// Pit stops
app.get("/api/:season/:round/pitstops", (req, res) => {
    res.json(mockPitStops);
});

// Lap times
app.get("/api/:season/:round/laps", (req, res) => {
    res.json(mockLaps);
});

// Status info
app.get("/api/status", (req, res) => {
    res.json(mockStatus);
});
export default app;
