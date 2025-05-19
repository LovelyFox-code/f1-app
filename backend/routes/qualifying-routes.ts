import express from "express";
import mockQualifying from "../mock-data/qualifying.ts";

const router = express.Router();

router.get("/:season/:round/qualifying", (req, res) => {
    res.json(mockQualifying);
});

export default router;
