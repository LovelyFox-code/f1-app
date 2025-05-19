// Frontend-specific types that extend or modify API types
export interface Champion {
    givenName: string;
    familyName: string;
    constructorName: string;
    nationality: string;
}

export interface SeasonResult {
    season: string;
    champion: Champion;
    rounds: number;
}

export interface ChampionStats {
    driver: {
        givenName: string;
        familyName: string;
        nationality: string;
        totalChampionships: number;
        totalRaceWins: number;
        totalPodiums: number;
        bestSeason: {
            year: string;
            wins: number;
            points: number;
        };
    };
    constructor: {
        name: string;
        totalChampionships: number;
    };
}