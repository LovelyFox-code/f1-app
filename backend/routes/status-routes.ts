import express from "express";
import mockStatus from "../mock-data/status.ts";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(mockStatus);
});

export default router;
