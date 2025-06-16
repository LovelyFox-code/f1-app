import { useQuery } from "@tanstack/react-query";
import { RaceResult } from "@/types/api";
import { fetchRacesWithResults, getRetryLogic } from "@/utils/data-fetchers";

export const useSeasonRaceResults = (year: string) => {
  return useQuery<RaceResult[], Error>({
    queryKey: ["seasonResults", year],
    queryFn: async () => {
      const results = await fetchRacesWithResults(year, "useSeasonRaceResults");

      return results.map((result) => ({
        ...result,
        id: `${result.round}-${result.driver.givenName}-${result.driver.familyName}`,
      }));
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!year,
    retry: getRetryLogic(),
  });
};
