import { Race, Season, RaceResult } from "@/types/api";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      console.error(`${context} - Network Error: Unable to connect to the API server at ${API_BASE_URL}`);
      console.error("Please check if the backend server is running.");
    } else {
      console.error(`${context} - Status: ${error.response.status}, Message: ${error.message}`);
    }
  } else {
    console.error(`${context}:`, error);
  }
  
  // Only throw if context isn't about fetching seasons
  if (!context.includes("Error fetching seasons")) {
    throw error;
  }
};

export const apiService = {
  // Seasons
  getSeasons: async (): Promise<Season[]> => {
    try {
      const response = await api.get("/seasons");
      return response.data;
    } catch (error) {
      handleApiError(error, "Error fetching seasons");
      return []; // Return empty array on error
    }
  },

  getSeason: async (year: string): Promise<Season> => {
    try {
      const response = await api.get(`/seasons/${year}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Error fetching season ${year}`);
      throw error;
    }
  },

  // Races
  getRaces: async (year: string): Promise<Race[]> => {
    try {
      const response = await api.get(`/seasons/${year}/races`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Error fetching races for year ${year}`);
      return []; // This line will never execute due to the throw in handleApiError, but TS needs it
    }
  },

  // Results
  getRaceResults: async (year: string, round: number): Promise<RaceResult[]> => {
    try {
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
    } catch (error) {
      handleApiError(error, `Error fetching race results for year ${year}, round ${round}`);
      return []; // This line will never execute due to the throw in handleApiError, but TS needs it
    }
  },
};

export default apiService; 