import { useQuery } from "@tanstack/react-query";
import { fetchSeasonData, SeasonDataResult, getRetryLogic } from "@/utils/data-fetchers";

export function useSeasonData(year: string) {
  return useQuery<SeasonDataResult, Error>({
    queryKey: ["seasonData", year],
    queryFn: async () => fetchSeasonData(year, "useSeasonData"),
    enabled: !!year,
    retry: getRetryLogic(),
  });
} 