// Base types for common properties
export interface BaseEntity {
  id: string;
  url: string;
}

// Driver types
export interface Driver extends BaseEntity {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  constructorName?: string;
}

// Constructor types
export interface Constructor extends BaseEntity {
  constructorId: string;
  name: string;
  nationality: string;
}

// Circuit types
export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
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
    grid: string;
    status: string;
    laps: string;
    time?: {
      time: string;
    };
    fastestLap?: {
      rank: string;
      lap: string;
      time?: {
        time: string;
      };
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
    constructor: string;
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

// API Request types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SeasonQueryParams extends PaginationParams {
  year?: string;
  driverId?: string;
  constructorId?: string;
}

export interface RaceQueryParams extends PaginationParams {
  season?: string;
  round?: string;
  circuitId?: string;
  driverId?: string;
  constructorId?: string;
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

export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  driver: Driver;
  constructors: Constructor[];
}

export interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  constructor: Constructor;
}