import express from "express";
import { Season } from "../models/season-model.ts";
import { Race } from "../models/race-model.ts";

const router = express.Router();

// Get all seasons from 2005 to present
router.get("/", (async (_req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const seasons = await Season.find({
            season: { $gte: "2005", $lte: currentYear.toString() }
        }).sort({ season: -1 });

        res.json(seasons);
    } catch (err) {
        console.error("Error fetching seasons:", err);
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "Unknown error"
        });
    }
}) as express.RequestHandler);

// Get a specific season
router.get("/:season", (async (req, res) => {
    const { season } = req.params;

    try {
        const foundSeason = await Season.findOne({ season });

        if (!foundSeason) {
            return res.status(404).json({ message: "Season not found" });
        }

        res.json(foundSeason);
    } catch (err) {
        console.error("Error fetching season:", err);
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "Unknown error"
        });
    }
}) as express.RequestHandler);

// Get races for a season
router.get("/:season/races", (async (req, res) => {
    const { season } = req.params;

    try {
        const races = await Race.find({ season }).sort({ round: 1 });

        if (races.length === 0) {
            return res.status(404).json({ message: "No races found for this season" });
        }

        res.json(races);
    } catch (err) {
        console.error("Error fetching races:", err);
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "Unknown error"
        });
    }
}) as express.RequestHandler);

export default router;
