import axios from "axios";
import { Season } from "../../models/season-model.js";
import { Race } from "../../models/race-model.js";
import { fetchAndStoreSeasons } from "../../services/season-service.ts";
import { fetchAndStoreRaces } from "../../services/race-service.ts";
import { fetchAndStoreChampions } from "../../services/season-champion-service.ts";
import pLimit from "p-limit";

// Mocks
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../models/season-model.js");
jest.mock("../../models/race-model.js");

jest.mock("p-limit", () => {
  return () => (fn: () => Promise<any>) => fn();
});

describe("Ergast Service", () => {
  beforeEach(() => {
    process.env.ERGAST_API = "https://api.jolpi.ca/ergast/f1";
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "warn").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });
  });

  describe("fetchAndStoreSeasons", () => {
    it("should fetch and store seasons successfully", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          MRData: {
            SeasonTable: {
              Seasons: [{ season: "2023" }, { season: "2024" }]
            }
          }
        }
      });

      (Season.findOneAndUpdate as jest.Mock).mockResolvedValue({ season: "2024" });

      await fetchAndStoreSeasons();

      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("/seasons.json"));
      expect(Season.findOneAndUpdate).toHaveBeenCalledTimes(2);
    });

    it("should handle API errors", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
      await expect(fetchAndStoreSeasons()).rejects.toThrow("API Error");
    });
  });

  describe("fetchAndStoreRaces", () => {
    const mockSeason = { season: "2024" };
    const mockRacesResponse = {
      data: {
        MRData: {
          total: "1",
          RaceTable: {
            Races: [{
              season: "2024",
              round: 1,
              raceName: "Bahrain GP",
              date: "2024-03-02",
              time: "15:00:00Z",
              Circuit: {
                circuitId: "bahrain",
                circuitName: "Bahrain International Circuit"
              },
              Results: [{
                number: "44",
                position: "1",
                positionText: "1",
                points: "25",
                Driver: {
                  driverId: "hamilton",
                  givenName: "Lewis",
                  familyName: "Hamilton",
                  nationality: "British"
                },
                Constructor: {
                  constructorId: "mercedes",
                  name: "Mercedes",
                  nationality: "German"
                }
              }]
            }]
          }
        }
      }
    };

    beforeEach(() => {
      (Season.find as jest.Mock).mockResolvedValue([mockSeason]);
      (Race.findOneAndUpdate as jest.Mock).mockResolvedValue({
        season: "2024",
        round: "1",
        raceName: "Bahrain GP"
      });
    });

    it("should fetch and store races successfully", async () => {
      mockedAxios.get.mockResolvedValueOnce(mockRacesResponse);

      await fetchAndStoreRaces();

      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("/2024/results.json"));
      expect(Race.findOneAndUpdate).toHaveBeenCalledWith(
        { season: "2024", round: 1 },
        expect.objectContaining({
          season: "2024",
          round: "1",
          raceName: "Bahrain GP"
        }),
        expect.any(Object)
      );
    });
  });

  describe("fetchAndStoreChampions", () => {
    const mockSeason = { season: "2024" };

    beforeEach(() => {
      (Season.find as jest.Mock).mockResolvedValue([mockSeason]);
    });

    it("should handle missing champion data", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          MRData: {
            StandingsTable: {
              StandingsLists: []
            }
          }
        }
      });

      await fetchAndStoreChampions();

      expect(Season.updateOne).not.toHaveBeenCalled();
    });

    it("should handle API errors gracefully", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
      await fetchAndStoreChampions();
      expect(Season.updateOne).not.toHaveBeenCalled();
    });
  });
});
