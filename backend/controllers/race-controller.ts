import express from "express";
import { Race } from "../models/race-model.ts";
import { handleServerError, notFound } from "../utils/errors.ts";

const router = express.Router();

export const getRacesForSeason = router.get("/:season/races", (async (req, res) => {
    const { season } = req.params;

    try {
        const races = await Race.find({ season }).sort({ round: 1 });

        if (races.length === 0) {
            return notFound(res, "Races");
        }

        res.json(races);
    } catch (err) {
        console.error("Error fetching races:", err);
        handleServerError(res, err);
    }
}) as express.RequestHandler);