import { describe, it, expect, vi, beforeEach } from "vitest";
import apiService from "./api";

// Create mock function using hoisted
const mockGet = vi.hoisted(() => vi.fn());

// Mock axios
vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: mockGet,
    }),
  },
}));

describe("apiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSeasons", () => {
    it("returns seasons data on successful request", async () => {
      const mockSeasons = [
        { season: "2023", rounds: 22 },
        { season: "2022", rounds: 22 },
      ];
      mockGet.mockResolvedValueOnce({ data: mockSeasons });

      const result = await apiService.getSeasons();
      expect(result).toEqual(mockSeasons);
    });

    it("returns empty array on error", async () => {
      mockGet.mockRejectedValueOnce(new Error("Network error"));

      const result = await apiService.getSeasons();
      expect(result).toEqual([]);
    });
  });

  describe("getSeason", () => {
    it("returns season data for specific year", async () => {
      const mockSeason = { season: "2023", rounds: 22 };
      mockGet.mockResolvedValueOnce({ data: mockSeason });

      const result = await apiService.getSeason("2023");
      expect(result).toEqual(mockSeason);
    });

    it("throws error when request fails", async () => {
      mockGet.mockRejectedValueOnce(new Error("Not found"));

      await expect(apiService.getSeason("2023")).rejects.toThrow("Not found");
    });
  });

  describe("getRaces", () => {
    it("returns races data for specific year", async () => {
      const mockRaces = [
        { round: 1, raceName: "Bahrain Grand Prix" },
        { round: 2, raceName: "Saudi Arabian Grand Prix" },
      ];
      mockGet.mockResolvedValueOnce({ data: mockRaces });

      const result = await apiService.getRaces("2023");
      expect(result).toEqual(mockRaces);
    });

    it("throws error when request fails", async () => {
      mockGet.mockRejectedValueOnce(new Error("Not found"));

      await expect(apiService.getRaces("2023")).rejects.toThrow("Not found");
    });
  });

  describe("getRaceResults", () => {
    it("returns race results for specific race", async () => {
      const mockRaces = [
        {
          round: 1,
          results: [
            {
              position: "1",
              points: "25",
              driver: {
                givenName: "Max",
                familyName: "Verstappen",
                nationality: "Dutch",
              },
              constructor: {
                name: "Red Bull Racing",
              },
            },
          ],
        },
      ];
      mockGet.mockResolvedValueOnce({ data: mockRaces });

      const result = await apiService.getRaceResults("2023", 1);
      expect(result).toEqual([
        {
          round: 1,
          position: "1",
          points: "25",
          driver: {
            givenName: "Max",
            familyName: "Verstappen",
            nationality: "Dutch",
          },
          constructor: {
            name: "Red Bull Racing",
          },
        },
      ]);
    });

    it("throws error when race not found", async () => {
      const mockRaces = [{ round: 1 }];
      mockGet.mockResolvedValueOnce({ data: mockRaces });

      await expect(apiService.getRaceResults("2023", 2)).rejects.toThrow(
        "Race not found"
      );
    });

    it("throws error when request fails", async () => {
      mockGet.mockRejectedValueOnce(new Error("Not found"));

      await expect(apiService.getRaceResults("2023", 1)).rejects.toThrow(
        "Not found"
      );
    });
  });
}); 