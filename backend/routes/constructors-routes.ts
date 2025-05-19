import express from "express";
import mockConstructors from "../mock-data/constructors.ts";

const router = express.Router();

router.get("/:season/constructors", (req, res) => {
    res.json(mockConstructors);
});

export default router;
