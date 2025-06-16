import { apiService } from "@/services/api";
import { calculateChampionStats } from "@/utils/calculate-champion-stats";
import { RaceResult, Season, ChampionStats } from "@/types/api";
import axios from "axios";

/**
 * Error handling utility for API requests
 */
export const handleApiError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error) && !error.response) {
    process.stdout.write(`[${context}] Network Error: Unable to connect to the API server\n`);
    throw new Error("Network error: Unable to connect to the API server. Please check if the backend is running.");
  }

  process.stdout.write(`[${context}] Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
  throw error;
};

/**
 * Fetches all seasons
 */
export const fetchSeasons = async (context: string = "fetchSeasons"): Promise<Season[]> => {
  try {
    const seasons = await apiService.getSeasons();
    return seasons;
  } catch (error) {
    process.stdout.write(`[${context}] Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    throw error; // Rethrow the error so React Query can handle it
  }
};

/**
 * Fetches races with results for a specific year
 */
export const fetchRacesWithResults = async (year: string, context: string = "fetchRacesWithResults"): Promise<RaceResult[]> => {
  try {
    process.stdout.write(`[${context}] Fetching races for year ${year}...\n`);
    const races = await apiService.getRaces(year);

    if (!races || races.length === 0) {
      process.stdout.write(`[${context}] No races found for year ${year}\n`);
      return [];
    }

    process.stdout.write(`[${context}] Found ${races.length} races for year ${year}\n`);

    const racesWithResults = await Promise.all(
      races.map(async (race) => {
        try {
          const results = await apiService.getRaceResults(year, race.round);
          return results;
        } catch (error) {
          process.stdout.write(`[${context}] Error fetching results for race ${race.round}: ${error instanceof Error ? error.message : "Unknown error"}\n`);
          return [];
        }
      })
    );

    process.stdout.write(`[${context}] Successfully fetched results for ${racesWithResults.length} races\n`);
    return racesWithResults.flat();
  } catch (error) {
    return handleApiError(error, context);
  }
};

export interface SeasonDataResult {
  currentSeason: Season;
  raceResults: RaceResult[];
  championStats: ChampionStats;
}

/**
 * Fetches comprehensive season data including champion stats
 */
export const fetchSeasonData = async (year: string, context: string = "fetchSeasonData"): Promise<SeasonDataResult> => {
  try {
    process.stdout.write(`[${context}] Starting data fetch for year ${year}...\n`);

    const seasons = await fetchSeasons(context);
    const currentSeason = seasons.find((s) => s.season === year);

    if (!currentSeason) {
      throw new Error(`Season ${year} not found`);
    }

    process.stdout.write(`[${context}] Found season ${year} with ${currentSeason.rounds} rounds\n`);

    const raceResults = await fetchRacesWithResults(year, context);

    if (!raceResults || raceResults.length === 0) {
      throw new Error(`No races found for season ${year}`);
    }

    process.stdout.write(`[${context}] Processing ${raceResults.length} race results for champion stats\n`);

    const championStats = calculateChampionStats(
      currentSeason.champion,
      currentSeason.champion.constructorName,
      raceResults,
      seasons,
      year
    );

    process.stdout.write(`[${context}] Successfully calculated champion stats\n`);

    return {
      currentSeason,
      raceResults,
      championStats,
    };
  } catch (error) {
    return handleApiError(error, context);
  }
};

/**
 * Retry logic for React Query
 */
export const getRetryLogic = () => {
  return (failureCount: number, error: Error) => {
    if (axios.isAxiosError(error) && !error.response) {
      return failureCount < 1; // Try network errors only once
    }
    return failureCount < 3; // Try other errors up to 3 times
  };
}; 