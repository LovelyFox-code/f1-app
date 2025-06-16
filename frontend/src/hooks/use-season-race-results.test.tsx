import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSeasonRaceResults } from "./use-season-race-results";
import { RaceResult } from "../types/api";
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

// Mock the data fetchers module
vi.mock("@/utils/data-fetchers", () => ({
  fetchRacesWithResults: vi.fn(),
  getRetryLogic: vi.fn().mockReturnValue(() => false),
}));

// Import the mocked module
import { fetchRacesWithResults } from "@/utils/data-fetchers";

describe("useSeasonRaceResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and return race results data", async () => {
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

    vi.mocked(fetchRacesWithResults).mockResolvedValueOnce(mockResults);

    const { result } = renderHook(() => useSeasonRaceResults("2023"), {
      wrapper: createWrapper(),
    });

    // Initial state should show loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to be fetched
    await waitFor(() => {
      expect(result.current.data).toEqual(mockResults);
    });

    // Check final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors", async () => {
    const error = new Error("Failed to fetch race results");
    vi.mocked(fetchRacesWithResults).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSeasonRaceResults("2023"), {
      wrapper: createWrapper(),
    });

    // Initial state should show loading
    expect(result.current.isLoading).toBe(true);

    // Wait for error to be handled
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    // Check final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
