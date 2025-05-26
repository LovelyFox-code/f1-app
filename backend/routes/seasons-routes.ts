import express from "express";
import { getAllSeasons, getSeason } from "../controllers/season-controller.ts";
import { getRacesForSeason } from "../controllers/race-controller.ts";

const router = express.Router();

router.get("/", getAllSeasons);
router.get("/:season", getSeason);
router.get("/:season/races", getRacesForSeason);

export default router;
