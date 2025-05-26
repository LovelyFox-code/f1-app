import express from "express";
import { Season } from "../models/season-model.ts";
import { handleServerError, notFound } from "../utils/errors.ts";

const router = express.Router();

export const getAllSeasons = router.get("/", (async (_req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const seasons = await Season.find({
            season: { $gte: "2005", $lte: currentYear.toString() }
        }).sort({ season: -1 });

        res.json(seasons);
    } catch (err) {
        console.error("Error fetching seasons:", err);
        handleServerError(res, err, "Error fetching seasons");
    }
}) as express.RequestHandler);

export const getSeason = router.get("/:season", (async (req, res) => {
    const { season } = req.params;

    try {
        const foundSeason = await Season.findOne({ season });

        if (!foundSeason) {
            return notFound(res, "Season");
        }

        res.json(foundSeason);
    } catch (err) {
        console.error("Error fetching season:", err);
        handleServerError(res, err, "Error fetching season");
    }
}) as express.RequestHandler);
