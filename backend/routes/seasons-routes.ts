import express from "express";
import { getAllSeasons, getSeason } from "../controllers/season-controller.ts";
import { getRacesForSeason } from "../controllers/race-controller.ts";
import { validate } from "../middleware/validation.ts";
import { validateGetAllSeasons, validateGetSeason } from "../middleware/season-validators.ts";
import { validateGetRacesForSeason } from "../middleware/race-validators.ts";

const router = express.Router();

router.get("/", validate(validateGetAllSeasons), getAllSeasons);
router.get("/:season", validate(validateGetSeason), getSeason);
router.get("/:season/races", validate(validateGetRacesForSeason), getRacesForSeason);

export default router;
