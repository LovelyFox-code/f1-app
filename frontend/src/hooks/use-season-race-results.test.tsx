import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSeasonRaceResults } from "./use-season-race-results";
import apiService from "../services/api";
import { Race, RaceResult } from "../types/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

// Create a wrapper component with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";
  return Wrapper;
};

// Mock the API service
vi.mock("../services/api", () => ({
  default: {
    getRaces: vi.fn(),
    getRaceResults: vi.fn(),
  },
}));

describe("useSeasonRaceResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and return race results data", async () => {
    const mockRaces: Race[] = [
      {
        id: "2023_1",
        url: "https://example.com/race/2023/1",
        season: "2023",
        round: 1,
        raceName: "Bahrain Grand Prix",
        circuit: {
          circuitName: "Bahrain International Circuit",
          location: {
            country: "Bahrain",
          },
        },
        date: "2023-03-05",
        time: "15:00:00Z",
        results: [],
      },
    ];

    const mockResults: RaceResult[] = [
      {
        id: "1-Max-Verstappen",
        round: 1,
        position: "1",
        points: "25",
        driver: {
          givenName: "Max",
          familyName: "Verstappen",
          nationality: "Dutch",
        },
        constructor: {
          name: "Red Bull Racing",
        },
        grid: "1",
        status: "Finished",
        laps: "57",
      },
    ];

    vi.mocked(apiService.getRaces).mockResolvedValueOnce(mockRaces);
    vi.mocked(apiService.getRaceResults).mockResolvedValueOnce(mockResults);

    const { result } = renderHook(() => useSeasonRaceResults("2023"), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for data to be fetched
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check final state
    expect(result.current.data).toEqual(mockResults);
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors", async () => {
    const error = new Error("Failed to fetch race results");
    vi.mocked(apiService.getRaces).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSeasonRaceResults("2023"), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for error to be handled
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check final state
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(error);
  });
});
