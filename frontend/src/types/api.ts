// Base types for common properties
export interface BaseEntity {
  id: string;
  url: string;
}

// Driver types
export interface Driver extends BaseEntity {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  constructorName?: string;
}
export interface Circuit extends BaseEntity {
  circuitId: string;
  circuitName: string;
  location: Location;
}

// Race result types
export interface RaceResult {
  id: string;
  round: number;
  position: string;
  points: string;
  driver: {
    givenName: string;
    familyName: string;
    nationality: string;
  };
  constructor: {
    name: string;
  };
  grid: string;
  status: string;
  laps: string;
  time?: string;
  fastestLap?: {
    rank: string;
    lap: string;
    time: string;
    averageSpeed: string;
  };
}

// Race types
export interface Race extends BaseEntity {
  season: string;
  round: number;
  raceName: string;
  circuit: {
    circuitName: string;
    location: {
      country: string;
    };
  };
  date: string;
  time: string;
  results: {
    position: string;
    points: string;
    driver: {
      givenName: string;
      familyName: string;
      nationality: string;
    };
    constructor: {
      name: string;
    };
  }[];
  winnerIsChampion?: boolean;
}

// Season types
export interface Season {
  _id: string;
  season: string;
  rounds: number;
  champion: {
    givenName: string;
    familyName: string;
    nationality: string;
    constructorName: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Error types
export interface ApiError {
  status: number;
  message: string;
  errors?: {
    [key: string]: string[];
  };
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