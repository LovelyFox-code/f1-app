import { Race, Season, RaceResult } from "@/types/api";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Seasons
  getSeasons: async (): Promise<Season[]> => {
    try {
      const response = await api.get("/seasons");
      return response.data;
    } catch (error) {
      console.error("Error fetching seasons:", error);
      return [];
    }
  },

  getSeason: async (year: string): Promise<Season> => {
    const response = await api.get(`/seasons/${year}`);
    return response.data;
  },

  // Races
  getRaces: async (year: string): Promise<Race[]> => {
    const response = await api.get(`/seasons/${year}/races`);
    return response.data;
  },

  // Results
  getRaceResults: async (year: string, round: number): Promise<RaceResult[]> => {
    const response = await api.get(`/seasons/${year}/races`);
    const race = response.data.find((r: Race) => r.round === round);

    if (!race) {
      throw new Error("Race not found");
    }
    return race.results.map((result: Race["results"][0]) => ({
      round: race.round,
      position: result.position,
      points: result.points,
      driver: {
        givenName: result.driver.givenName,
        familyName: result.driver.familyName,
        nationality: result.driver.nationality,
      },
      constructor: {
        name: result.constructor.name,
      },
    }));
  },
};

export default apiService; 