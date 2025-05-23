import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Season } from "@/types/api";

export const useSeasons = () => {
    return useQuery<Season[]>({
        queryKey: ["seasons"],
        queryFn: async () => {
            const seasonsData = await apiService.getSeasons();
            return seasonsData;
        },
        staleTime: 1000 * 60 * 10,
    });
};
