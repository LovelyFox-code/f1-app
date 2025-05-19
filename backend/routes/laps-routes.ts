import express from "express";
import mockLaps from "../mock-data/laps.ts";

const router = express.Router();

router.get("/:season/:round/laps", (req, res) => {
    res.json(mockLaps);
});

export default router;
