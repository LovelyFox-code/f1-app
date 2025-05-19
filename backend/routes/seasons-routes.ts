import express from "express";
import mockSeasons from "../mock-data/seasons.ts";
import mockRaces from "../mock-data/races.ts";
import mockDrivers from "../mock-data/drivers.ts";


const router = express.Router();

router.get("/", (_req, res) => {
    res.json(mockSeasons);
});

router.get("/:season", (req, res) => {
    const { season } = req.params;
    const foundSeason = mockSeasons.find((s) => s.season === season);
    if (foundSeason) {
        res.json(foundSeason);
    } else {
        res.status(404).json({ message: "Season not found" });
    }
});

router.get("/:season/races", (req, res) => {
    const { season } = req.params;
    const races = mockRaces.filter((r) => r.season === season);
    res.json(races);
});

router.get("/:season/drivers", ((req, res) => {
    const { season } = req.params;
    const drivers = mockDrivers.filter((d) => d.season === season);
    if (drivers.length === 0) {
        return res.status(404).json({ message: "No drivers found for this season" });
    }
    res.json(drivers);
}) as express.RequestHandler);

export default router;
