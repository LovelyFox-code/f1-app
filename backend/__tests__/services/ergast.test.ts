import axios from "axios";
import { Season } from "../../models/season-model.js";
import { Race } from "../../models/race-model.js";
import { fetchAndStoreSeasons } from "../../services/season-service.ts";
import { fetchAndStoreRaces } from "../../services/race-service.ts";
import { fetchAndStoreChampions } from "../../services/season-champion-service.ts";

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
    const raceEndpoint = "/2024.json";
    const resultsEndpoint = "/2024/1/results.json";

    const mockRacesResponse = {
      data: {
        MRData: {
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
              }
            }]
          }
        }
      }
    };

    const mockResultsResponse = {
      data: {
        MRData: {
          RaceTable: {
            Races: [{
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
    });

    it("should fetch and store races successfully", async () => {
      mockedAxios.get
        .mockResolvedValueOnce(mockRacesResponse)
        .mockResolvedValueOnce(mockResultsResponse);

      await fetchAndStoreRaces();

      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(raceEndpoint));
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(resultsEndpoint));
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

    it("should handle rate limiting (429)", async () => {
      mockedAxios.get
        .mockRejectedValueOnce({ response: { status: 429 } })
        .mockResolvedValueOnce(mockRacesResponse)
        .mockResolvedValueOnce(mockResultsResponse);

      await fetchAndStoreRaces();

      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
      expect(mockedAxios.get.mock.calls[0][0]).toContain(raceEndpoint);
      expect(mockedAxios.get.mock.calls[1][0]).toContain(raceEndpoint);
      expect(mockedAxios.get.mock.calls[2][0]).toContain(resultsEndpoint);
    });

    it("should handle missing results data", async () => {
      mockedAxios.get
        .mockResolvedValueOnce(mockRacesResponse)
        .mockResolvedValueOnce({
          data: {
            MRData: {
              RaceTable: {
                Races: [{
                  Results: []
                }]
              }
            }
          }
        });

      await fetchAndStoreRaces();

      expect(Race.findOneAndUpdate).toHaveBeenCalledWith(
        { season: "2024", round: 1 },
        expect.objectContaining({
          results: []
        }),
        expect.any(Object)
      );
    });
  });

  describe("fetchAndStoreChampions", () => {
    const mockSeason = { season: "2024" };
    const championEndpoint = "/2024/driverstandings/1.json";

    beforeEach(() => {
      (Season.find as jest.Mock).mockResolvedValue([mockSeason]);
    });

    it("should fetch and store champion successfully", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          MRData: {
            StandingsTable: {
              StandingsLists: [{
                DriverStandings: [{
                  Driver: {
                    givenName: "Max",
                    familyName: "Verstappen",
                    nationality: "Dutch"
                  },
                  Constructors: [{
                    name: "Red Bull Racing"
                  }]
                }]
              }]
            }
          }
        }
      });

      (Season.updateOne as jest.Mock).mockResolvedValueOnce({ modifiedCount: 1 });

      await fetchAndStoreChampions();

      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(championEndpoint));
      expect(Season.updateOne).toHaveBeenCalledWith(
        { season: "2024" },
        expect.objectContaining({
          champion: {
            givenName: "Max",
            familyName: "Verstappen",
            nationality: "Dutch",
            constructorName: "Red Bull Racing"
          }
        })
      );
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
