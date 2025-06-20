import express from "express";
import { handleServerError, notFound } from "../utils/errors.ts";
import { getAllSeasons as getAllSeasonsService, getSeasonByYear } from "../services/season-service.ts";

export const getAllSeasons = (async (_req, res) => {
    try {
        const seasons = await getAllSeasonsService();
        res.json(seasons);
    } catch (err) {
        console.error("Error fetching seasons:", err);
        handleServerError(res, err, "Error fetching seasons");
    }
}) as express.RequestHandler;

export const getSeason = (async (req, res) => {
    const { season } = req.params;

    try {
        const foundSeason = await getSeasonByYear(season);

        if (!foundSeason) {
            return notFound(res, "Season");
        }

        res.json(foundSeason);
    } catch (err) {
        console.error("Error fetching season:", err);
        handleServerError(res, err, "Error fetching season");
    }
}) as express.RequestHandler;
