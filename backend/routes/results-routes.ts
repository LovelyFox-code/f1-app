import express from "express";
import mockResults from "../mock-data/results.ts";

const router = express.Router();

router.get("/:season/:round/results", (req, res) => {
    const { season, round } = req.params;
    const results = mockResults.filter(r => r.season === season && r.round === round);
    res.json(results);
});

export default router;
