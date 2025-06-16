import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSeasons } from "./use-seasons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the data fetchers module
vi.mock("@/utils/data-fetchers", () => ({
  fetchSeasons: vi.fn(),
  getRetryLogic: vi.fn().mockReturnValue(() => false),
}));

// Import the mocked module
import { fetchSeasons } from "@/utils/data-fetchers";

// Create a wrapper with QueryClientProvider
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSeasons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and return seasons data", async () => {
    const mockSeasons = [
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
    ];

    vi.mocked(fetchSeasons).mockResolvedValue(mockSeasons);

    const { result } = renderHook(() => useSeasons(), { wrapper });

    // Wait for the hook to finish
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check final state
    expect(result.current.data).toEqual(mockSeasons);
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors", async () => {
    const error = new Error("Failed to fetch seasons");
    vi.mocked(fetchSeasons).mockRejectedValue(error);

    const { result } = renderHook(() => useSeasons(), { wrapper });

    // Wait for the hook to finish
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check final state
    expect(result.current.error).not.toBeNull();
    expect(result.current.data).toBeUndefined();
  });
});
