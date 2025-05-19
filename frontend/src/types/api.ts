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
  number: string;
  position: string;
  positionText: string;
  points: string;
  round: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}

// Race types
export interface Race extends BaseEntity {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: {
      country: string;
    };
  };
  date: string;
  time: string;
  Results: {
    position: string;
    Driver: {
      givenName: string;
      familyName: string;
    };
    Constructor: {
      name: string;
    };
  }[];
}

// Season types
export interface SeasonStandings {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructor: Constructor;
}

export interface ConstructorStandings {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface Season extends BaseEntity {
  season: string;
  url: string;
  races: Race[];
  driverStandings: SeasonStandings[];
  constructorStandings: ConstructorStandings[];
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