import express from "express";
import { Race } from "../models/race-model.ts";

const router = express.Router();
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