import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { RaceResult } from "@/types/api";

export const useSeasonRaceResults = (year: string) => {
  return useQuery<RaceResult[]>({
    queryKey: ["seasonResults", year],
    queryFn: async () => {
      console.time("Fetch season races");
      const racesData = await apiService.getRaces(year);

      if (!racesData || racesData.length === 0) {
        throw new Error("No races found for this season");
      }

      const resultsPromises = racesData.map(async (race) => {
        const results = await apiService.getRaceResults(year, race.round);
        return results.map((result) => ({
          ...result,
          round: race.round,
          id: `${race.round}-${result.driver.givenName}-${result.driver.familyName}`,
        }));
      });

      const results = await Promise.all(resultsPromises);
      console.timeEnd("Fetch all race results");
      return results.flat();
    },
    staleTime: 1000 * 60 * 5,
  });
};
