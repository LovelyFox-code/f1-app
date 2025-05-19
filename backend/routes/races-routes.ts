import express from "express";
import mockRaces from "../mock-data/races.ts";

const router = express.Router();

// All races for a given season
router.get("/:season/races", ((req, res) => {
    const { season } = req.params;
    const drivers = mockRaces.filter((r) => r.season === season);
    if (drivers.length === 0) {
        return res.status(404).json({ message: "No drivers found for this season" });
    }
    res.json(drivers);
}) as express.RequestHandler);

export default router;
