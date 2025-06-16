import { useQuery } from "@tanstack/react-query";
import { Season } from "@/types/api";
import { fetchSeasons, getRetryLogic } from "@/utils/data-fetchers";

export const useSeasons = () => {
    return useQuery<Season[], Error>({
        queryKey: ["seasons"],
        queryFn: async () => fetchSeasons("useSeasons"),
        staleTime: 1000 * 60 * 10,
        retry: getRetryLogic(),
    });
};
