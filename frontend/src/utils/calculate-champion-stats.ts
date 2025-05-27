import { RaceResult, Season, ChampionStats } from "@/types/api";

export const calculateChampionStats = (
    driver: { givenName: string; familyName: string; nationality: string },
    constructorName: string,
    raceResults: RaceResult[],
    seasons: Season[],
    year: string
): ChampionStats => {
    const isSameDriver = (result: RaceResult) =>
        result.driver?.givenName === driver.givenName &&
        result.driver?.familyName === driver.familyName;

    const totalChampionships = seasons.filter(
        (s) => s.champion?.constructorName === constructorName
    ).length;

    const totalRaceWins = raceResults.filter(
        (r) => isSameDriver(r) && r.position === "1"
    ).length;

    const totalPodiums = raceResults.filter(
        (r) => isSameDriver(r) && ["1", "2", "3"].includes(r.position)
    ).length;

    const totalPoints = raceResults
        .filter(isSameDriver)
        .reduce((sum, r) => sum + parseFloat(r.points), 0);

    return {
        driver: {
            givenName: driver.givenName,
            familyName: driver.familyName,
            nationality: driver.nationality,
            totalChampionships,
            totalRaceWins,
            totalPodiums,
            bestSeason: {
                year,
                wins: totalRaceWins,
                points: totalPoints,
            },
        },
        constructor: {
            name: constructorName,
            totalChampionships,
        },
    };
};
