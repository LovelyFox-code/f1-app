import express from "express";
import request from "supertest";
import seasonRoutes from "../../routes/seasons-routes.ts";

jest.mock("../../models/season-model.ts", () => ({
    Season: {
        find: jest.fn(),
        findOne: jest.fn()
    }
}));

jest.mock("../../models/race-model.ts", () => ({
    Race: {
        find: jest.fn()
    }
}));

import { Season } from "../../models/season-model.ts";
import { Race } from "../../models/race-model.ts";

const app = express();
app.use(express.json());
app.use("/seasons", seasonRoutes);

describe("Season Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("GET /seasons - should return all seasons", async () => {
        const mockSeasons = [{ season: "2024" }, { season: "2023" }];

        (Season.find as jest.Mock).mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockSeasons)
        });

        const res = await request(app).get("/seasons");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockSeasons);
        expect(Season.find).toHaveBeenCalled();
    });

    it("GET /seasons/:season - should return a season", async () => {
        const mockSeason = { season: "2024" };
        (Season.findOne as jest.Mock).mockResolvedValue(mockSeason);

        const res = await request(app).get("/seasons/2024");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockSeason);
        expect(Season.findOne).toHaveBeenCalledWith({ season: "2024" });
    });

    it("GET /seasons/:season - should return 404 if not found", async () => {
        (Season.findOne as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get("/seasons/1999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Season not found");
    });

    it("GET /seasons/:season/races - should return races", async () => {
        const mockRaces = [{ raceName: "Bahrain GP", round: 1 }];
        (Race.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue(mockRaces) });

        const res = await request(app).get("/seasons/2024/races");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRaces);
        expect(Race.find).toHaveBeenCalledWith({ season: "2024" });
    });

    it("GET /seasons/:season/races - should return 404 if no races", async () => {
        (Race.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        const res = await request(app).get("/seasons/2024/races");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Races not found");
    });
});
