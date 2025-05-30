import { describe, it, expect } from "vitest";
import { calculateChampionStats } from "./calculate-champion-stats";
import { RaceResult, Season } from "../types/api";

describe("calculateChampionStats", () => {
  const mockDriver = {
    givenName: "Max",
    familyName: "Verstappen",
    nationality: "Dutch",
  };

  const mockConstructorName = "Red Bull Racing";

  const mockRaceResults: RaceResult[] = [
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
    {
      id: "2-Max-Verstappen",
      round: 2,
      position: "2",
      points: "18",
      driver: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
      },
      constructor: {
        name: "Red Bull Racing",
      },
      grid: "2",
      status: "Finished",
      laps: "50",
    },
    {
      id: "3-Lewis-Hamilton",
      round: 3,
      position: "1",
      points: "25",
      driver: {
        givenName: "Lewis",
        familyName: "Hamilton",
        nationality: "British",
      },
      constructor: {
        name: "Mercedes",
      },
      grid: "1",
      status: "Finished",
      laps: "52",
    },
  ];

  const mockSeasons: Season[] = [
    {
      _id: "2021",
      season: "2021",
      rounds: 22,
      champion: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        constructorName: "Red Bull Racing",
      },
    },
    {
      _id: "2022",
      season: "2022",
      rounds: 22,
      champion: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        constructorName: "Red Bull Racing",
      },
    },
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

  it("should calculate correct champion stats", () => {
    const result = calculateChampionStats(
      mockDriver,
      mockConstructorName,
      mockRaceResults,
      mockSeasons,
      "2023"
    );

    expect(result).toEqual({
      driver: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        totalChampionships: 3,
        totalRaceWins: 1,
        totalPodiums: 2,
        bestSeason: {
          year: "2023",
          wins: 1,
          points: 43,
        },
      },
      constructor: {
        name: "Red Bull Racing",
        totalChampionships: 3,
      },
    });
  });

  it("should handle empty race results", () => {
    const result = calculateChampionStats(
      mockDriver,
      mockConstructorName,
      [],
      mockSeasons,
      "2023"
    );

    expect(result).toEqual({
      driver: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        totalChampionships: 3,
        totalRaceWins: 0,
        totalPodiums: 0,
        bestSeason: {
          year: "2023",
          wins: 0,
          points: 0,
        },
      },
      constructor: {
        name: "Red Bull Racing",
        totalChampionships: 3,
      },
    });
  });

  it("should handle empty seasons", () => {
    const result = calculateChampionStats(
      mockDriver,
      mockConstructorName,
      mockRaceResults,
      [],
      "2023"
    );

    expect(result).toEqual({
      driver: {
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch",
        totalChampionships: 0,
        totalRaceWins: 1,
        totalPodiums: 2,
        bestSeason: {
          year: "2023",
          wins: 1,
          points: 43,
        },
      },
      constructor: {
        name: "Red Bull Racing",
        totalChampionships: 0,
      },
    });
  });

  it("should handle driver with no results", () => {
    const result = calculateChampionStats(
      {
        givenName: "Charles",
        familyName: "Leclerc",
        nationality: "Monegasque",
      },
      "Ferrari",
      mockRaceResults,
      mockSeasons,
      "2023"
    );

    expect(result).toEqual({
      driver: {
        givenName: "Charles",
        familyName: "Leclerc",
        nationality: "Monegasque",
        totalChampionships: 0,
        totalRaceWins: 0,
        totalPodiums: 0,
        bestSeason: {
          year: "2023",
          wins: 0,
          points: 0,
        },
      },
      constructor: {
        name: "Ferrari",
        totalChampionships: 0,
      },
    });
  });
}); 