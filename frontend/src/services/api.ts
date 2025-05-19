import { Constructor, Driver, Race, Season } from '@/types/api';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Result {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export const apiService = {
  // Seasons
  getSeasons: async (): Promise<Season[]> => {
    const response = await api.get('/seasons');
    return response.data;
  },

  getSeason: async (season: string): Promise<Season> => {
    const response = await api.get(`/seasons/${season}`);
    return response.data;
  },

  // Races
  getRaces: async (season: string): Promise<Race[]> => {
    const response = await api.get(`/seasons/${season}/races`);
    return response.data;
  },

  // Drivers in a season
  getDrivers: async (season: string): Promise<Driver[]> => {
    const response = await api.get(`/seasons/${season}/drivers`);
    return response.data;
  },

  // Constructors
  getConstructors: async (season: string): Promise<Constructor[]> => {
    const response = await api.get(`/seasons/${season}/constructors`);
    return response.data;
  },

  // Results
  getRaceResults: async (season: string, round: string): Promise<Result[]> => {
    const response = await api.get(`/${season}/${round}/results`);
    return response.data;
  },

  // Standings
  getDriverStandings: async (season: string): Promise<DriverStanding[]> => {
    const response = await api.get(`/${season}/driver-standings`);
    return response.data;
  },

  // Champion 
  getChampion: async (season: string) => {
    const standings = await apiService.getDriverStandings(season);

    const topDriver = standings[0];

    return {
      givenName: topDriver.Driver.givenName,
      familyName: topDriver.Driver.familyName,
      nationality: topDriver.Driver.nationality,
      constructorName: topDriver.Constructors?.[0]?.name ?? "Unknown",
    };
  },

  // Constructor Standings
  getConstructorStandings: async (season: string): Promise<ConstructorStanding[]> => {
    const response = await api.get(`/${season}/constructor-standings`);
    return response.data;
  },
};

export default apiService; 