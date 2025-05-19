import express from "express";
import mockDrivers from "../mock-data/drivers.ts";

const router = express.Router();

router.get("/:season/drivers", ((req, res) => {
    const { season } = req.params;
    const drivers = mockDrivers.filter((d) => d.season === season);
    if (drivers.length === 0) {
        return res.status(404).json({ message: "No drivers found for this season" });
    }
    res.json(drivers);
}) as express.RequestHandler);

export default router;
