export interface Champion {
    givenName: string;
    familyName: string;
    constructorName: string;
    nationality: string;
}

export interface SeasonResult {
    season: string;
    champion: {
        givenName: string;
        familyName: string;
        constructorName: string;
        nationality: string;
    };
    rounds: number;
}

export interface RaceResult {
    round: number;
    raceName: string;
    date: string;
    Circuit: {
        circuitName: string;
        Location: {
            country: string;
        };
    };
    Results: Array<{
        position: string;
        Driver: {
            givenName: string;
            familyName: string;
        };
        Constructor: {
            name: string;
        };
    }>;
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
