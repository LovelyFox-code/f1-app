import { apiService } from "@/services/api";
import { calculateChampionStats } from "@/utils/calculate-champion-stats";

export async function getSeasons() {
  try {
    process.stdout.write("[getSeasons] Fetching all seasons...\n");
    const response = await apiService.getSeasons();
    process.stdout.write(`[getSeasons] Successfully fetched ${response.length} seasons\n`);
    return response;
  } catch (error) {
    process.stdout.write(`[getSeasons Error] Failed to fetch seasons: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    throw error;
  }
}

export async function getRacesWithResults(year: string) {
  try {
    process.stdout.write(`[getRacesWithResults] Fetching races for year ${year}...\n`);
    const races = await apiService.getRaces(year);

    if (!races || races.length === 0) {
      process.stdout.write(`[getRacesWithResults] No races found for year ${year}\n`);
      return [];
    }

    process.stdout.write(`[getRacesWithResults] Found ${races.length} races for year ${year}\n`);

    const racesWithResults = await Promise.all(
      races.map(async (race) => {
        try {
          const results = await apiService.getRaceResults(year, race.round);
          return results;
        } catch (error) {
          process.stdout.write(`[getRacesWithResults] Error fetching results for race ${race.round}: ${error instanceof Error ? error.message : "Unknown error"}\n`);
          return [];
        }
      })
    );

    process.stdout.write(`[getRacesWithResults] Successfully fetched results for ${racesWithResults.length} races\n`);
    return racesWithResults.flat();
  } catch (error) {
    process.stdout.write(`[getRacesWithResults Error] Failed to fetch races for year ${year}: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    throw error;
  }
}

export async function getSeasonData(year: string) {
  try {
    process.stdout.write(`[getSeasonData] Starting data fetch for year ${year}...\n`);

    const seasons = await getSeasons();
    const currentSeason = seasons.find((s) => s.season === year);

    if (!currentSeason) {
      throw new Error(`Season ${year} not found`);
    }

    process.stdout.write(`[getSeasonData] Found season ${year} with ${currentSeason.rounds} rounds\n`);

    const races = await getRacesWithResults(year);

    if (!races || races.length === 0) {
      throw new Error(`No races found for season ${year}`);
    }

    process.stdout.write(`[getSeasonData] Processing ${races.length} races for champion stats\n`);

    const championStats = calculateChampionStats(
      currentSeason.champion,
      currentSeason.champion.constructorName,
      races,
      seasons,
      year
    );

    process.stdout.write(`[getSeasonData] Successfully calculated champion stats\n`);

    return {
      currentSeason,
      raceResults: races,
      championStats,
    };
  } catch (error) {
    process.stdout.write(`[getSeasonData Error] Failed to fetch season data for year ${year}: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    throw error;
  }
}