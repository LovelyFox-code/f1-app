import express from "express";
import mockPitStops from "../mock-data/pitstops.ts";
const router = express.Router();

router.get("/:season/:round/pitstops", (req, res) => {
    res.json(mockPitStops);
});

export default router;
