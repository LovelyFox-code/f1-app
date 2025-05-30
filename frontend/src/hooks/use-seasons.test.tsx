import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSeasons } from "./use-seasons";
import apiService from "../services/api";
import { Season } from "../types/api";
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
    getSeasons: vi.fn(),
  },
}));

describe("useSeasons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and return seasons data", async () => {
    const mockSeasons: Season[] = [
      {
        _id: "2023",
        season: "2023",
        rounds: 22,
        champion: {
          givenName: "Max",
          familyName: "Verstappen",
          nationality: "Dutch",
          constructorName: "Red Bull Racing",
        },
      },
      {
        _id: "2022",
        season: "2022",
        rounds: 22,
        champion: {
          givenName: "Max",
          familyName: "Verstappen",
          nationality: "Dutch",
          constructorName: "Red Bull Racing",
        },
      },
    ];

    vi.mocked(apiService.getSeasons).mockResolvedValueOnce(mockSeasons);

    const { result } = renderHook(() => useSeasons(), {
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
    expect(result.current.data).toEqual(mockSeasons);
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors", async () => {
    const error = new Error("Failed to fetch seasons");
    vi.mocked(apiService.getSeasons).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSeasons(), {
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
