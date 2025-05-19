import express from "express";
import mockDriverStandings from "../mock-data/driver-standings.ts";
import mockConstructorStandings from "../mock-data/constructor-standings.ts";

const router = express.Router();

router.get("/:season/driver-standings", (req, res) => {
    res.json(mockDriverStandings);
});

router.get("/:season/constructor-standings", (req, res) => {
    res.json(mockConstructorStandings);
});

export default router;
