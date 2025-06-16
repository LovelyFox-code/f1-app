import { fetchSeasons, fetchRacesWithResults, fetchSeasonData } from "@/utils/data-fetchers";

// Re-export hooks for backward compatibility
export { useSeasons, useSeasonRaceResults, useSeasonData } from "@/hooks";

/**
 * Legacy function for fetching all seasons
 * @deprecated Use useSeasons hook from @/hooks/use-seasons instead
 */
export async function getSeasons() {
  return fetchSeasons("getSeasons");
}

/**
 * Legacy function for fetching races with results for a specific year
 * @deprecated Use useSeasonRaceResults hook from @/hooks/use-season-race-results instead
 */
export async function getRacesWithResults(year: string) {
  return fetchRacesWithResults(year, "getRacesWithResults");
}

/**
 * Legacy function for fetching comprehensive season data
 * @deprecated Use useSeasonData hook from @/hooks/use-season-data instead
 */
export async function getSeasonData(year: string) {
  return fetchSeasonData(year, "getSeasonData");
}