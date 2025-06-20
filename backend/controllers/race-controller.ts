import express from "express";
import { handleServerError, notFound } from "../utils/errors.ts";
import { getRacesBySeason } from "../services/race-service.ts";

export const getRacesForSeason = (async (req, res) => {
    const { season } = req.params;

    try {
        const races = await getRacesBySeason(season);

        if (races.length === 0) {
            return notFound(res, "Races");
        }

        res.json(races);
    } catch (err) {
        console.error("Error fetching races:", err);
        handleServerError(res, err);
    }
}) as express.RequestHandler;