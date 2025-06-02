import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSeasons, getRacesWithResults, getSeasonData } from "./season-data";
import { apiService } from "./api";
import { calculateChampionStats } from "../utils/calculate-champion-stats";
import { Season, RaceResult, Race } from "../types/api";

// Mock dependencies
vi.mock("./api", () => ({
  apiService: {
    getSeasons: vi.fn(),
    getRaces: vi.fn(),
    getRaceResults: vi.fn(),
  },
}));

vi.mock("../utils/calculate-champion-stats", () => ({
  calculateChampionStats: vi.fn(),
}));

describe("season-data service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSeasons", () => {
    it("should fetch and return seasons data", async () => {
      const mockSeasons: Season[] = [
        {
          _id: "2023",
          season: "2023",
          rounds: 22,
          champion: {
            givenName: "Max",
            familyName: "Verstappen",
            nationality: "Dutch",
            constructorName: "Red Bull Racing",
          },
        },
      ];

      vi.mocked(apiService.getSeasons).mockResolvedValueOnce(mockSeasons);

      const result = await getSeasons();
      expect(result).toEqual(mockSeasons);
    });

    it("should handle API errors", async () => {
      const error = new Error("Failed to fetch seasons");
      vi.mocked(apiService.getSeasons).mockRejectedValueOnce(error);

      await expect(getSeasons()).rejects.toThrow("Failed to fetch seasons");
    });
  });

  describe("getRacesWithResults", () => {
    it("should fetch and return races with results", async () => {
      const mockRaces: Race[] = [
        {
          id: "2023-1",
          url: "https://example.com/2023/1",
          season: "2023",
          round: 1,
          raceName: "Bahrain Grand Prix",
          circuit: {
            circuitName: "Bahrain International Circuit",
            location: {
              country: "Bahrain",
            },
          },
          date: "2023-03-05",
          time: "15:00:00Z",
          results: [],
          winnerIsChampion: false,
        },
        {
          id: "2023-2",
          url: "https://example.com/2023/2",
          season: "2023",
          round: 2,
          raceName: "Saudi Arabian Grand Prix",
          circuit: {
            circuitName: "Jeddah Corniche Circuit",
            location: {
              country: "Saudi Arabia",
            },
          },
          date: "2023-03-19",
          time: "17:00:00Z",
          results: [],
          winnerIsChampion: false,
        },
      ];

      const mockResults1: RaceResult[] = [
        {
          id: "1-Max-Verstappen",
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
          grid: "1",
          status: "Finished",
          laps: "57",
        },
      ];

      const mockResults2: RaceResult[] = [
        {
          id: "2-Sergio-Perez",
          round: 2,
          position: "1",
          points: "25",
          driver: {
            givenName: "Sergio",
            familyName: "Perez",
            nationality: "Mexican",
          },
          constructor: {
            name: "Red Bull Racing",
          },
          grid: "2",
          status: "Finished",
          laps: "50",
        },
      ];

      vi.mocked(apiService.getRaces).mockResolvedValueOnce(mockRaces);
      vi.mocked(apiService.getRaceResults)
        .mockResolvedValueOnce(mockResults1)
        .mockResolvedValueOnce(mockResults2);

      const result = await getRacesWithResults("2023");
      expect(result).toEqual([...mockResults1, ...mockResults2]);
    });

    it("should return empty array when no races found", async () => {
      vi.mocked(apiService.getRaces).mockResolvedValueOnce([]);

      const result = await getRacesWithResults("2023");
      expect(result).toEqual([]);
    });

    it("should handle API errors", async () => {
      const error = new Error("Failed to fetch season data");
      vi.mocked(apiService.getSeasons).mockRejectedValueOnce(error);

      await expect(getSeasonData("2023")).rejects.toThrow("Failed to fetch season data");
    });
  });

  describe("getSeasonData", () => {
    const mockSeason: Season = {
      _id: "2023",
      season: "2023",
      rounds: 22,
      champion: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        constructorName: "Red Bull Racing",
      },
    };

    const mockRaces: Race[] = [
      {
        id: "2023-1",
        url: "https://example.com/2023/1",
        season: "2023",
        round: 1,
        raceName: "Bahrain Grand Prix",
        circuit: {
          circuitName: "Bahrain International Circuit",
          location: {
            country: "Bahrain",
          },
        },
        date: "2023-03-05",
        time: "15:00:00Z",
        results: [],
        winnerIsChampion: false,
      },
    ];

    const mockResults: RaceResult[] = [
      {
        id: "1-Max-Verstappen",
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
        grid: "1",
        status: "Finished",
        laps: "57",
      },
    ];

    const mockChampionStats = {
      driver: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        totalChampionships: 3,
        totalRaceWins: 54,
        totalPodiums: 98,
        bestSeason: {
          year: "2023",
          wins: 19,
          points: 575,
        },
      },
      constructor: {
        name: "Red Bull Racing",
        totalChampionships: 6,
      },
    };

    it("should fetch and return complete season data", async () => {
      vi.mocked(apiService.getSeasons).mockResolvedValueOnce([mockSeason]);
      vi.mocked(apiService.getRaces).mockResolvedValueOnce(mockRaces);
      vi.mocked(apiService.getRaceResults).mockResolvedValueOnce(mockResults);
      vi.mocked(calculateChampionStats).mockReturnValueOnce(mockChampionStats);

      const result = await getSeasonData("2023");

      expect(result).toEqual({
        currentSeason: mockSeason,
        raceResults: mockResults,
        championStats: mockChampionStats,
      });
    });

    it("should throw error when season not found", async () => {
      vi.mocked(apiService.getSeasons).mockResolvedValueOnce([]);

      await expect(getSeasonData("2023")).rejects.toThrow("Season 2023 not found");
    });

    it("should throw error when no races found", async () => {
      vi.mocked(apiService.getSeasons).mockResolvedValueOnce([mockSeason]);
      vi.mocked(apiService.getRaces).mockResolvedValueOnce([]);

      await expect(getSeasonData("2023")).rejects.toThrow("No races found for season 2023");
    });

    it("should handle API errors", async () => {
      const error = new Error("Failed to fetch season data");
      vi.mocked(apiService.getSeasons).mockRejectedValueOnce(error);

      await expect(getSeasonData("2023")).rejects.toThrow("Failed to fetch season data");
    });
  });
}); 