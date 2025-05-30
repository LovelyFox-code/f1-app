import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SeasonPage from "./page";
import { describe, expect, it, vi } from "vitest";
import { getSeasonData } from "../../../services/season-data";

// Mock components to avoid rendering issues
vi.mock("@/components/client-navbar", () => ({
  default: () => <div>Nav Bar</div>,
}));

vi.mock("./components/season-header", () => ({
  default: ({ season, rounds }: { season: string; rounds: number }) => (
    <div data-testid="season-header">{`SeasonHeader: ${season}, ${rounds} rounds`}</div>
  ),
}));

vi.mock("@/components/error-display", () => ({
  default: ({ message }: { message: string }) => (
    <div>{`Error: ${message}`}</div>
  ),
}));

vi.mock("./components/champion-stats-section", () => ({
  default: () => <div>Champion Stats Section</div>,
}));

vi.mock("@/components/client-race-results-section", () => ({
  default: () => <div>Race Results Section</div>,
}));

// Mock the data fetching
vi.mock("../../../services/season-data", () => ({
  getSeasonData: vi.fn(),
}));

describe("SeasonPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the season header and champion stats", async () => {
    vi.mocked(getSeasonData).mockResolvedValueOnce({
      currentSeason: {
        _id: "2023",
        season: "2023",
        rounds: 22,
        champion: {
          givenName: "Max",
          familyName: "Verstappen",
          nationality: "Dutch",
          constructorName: "Red Bull Racing"
        },
      },
      raceResults: [],
      championStats: {
        driver: {
          givenName: "Max",
          familyName: "Verstappen",
          nationality: "Dutch",
          totalChampionships: 3,
          totalRaceWins: 54,
          totalPodiums: 98,
          bestSeason: {
            year: "2023",
            wins: 19,
            points: 575,
          },
        },
        constructor: {
          name: "Red Bull Racing",
          totalChampionships: 6,
        },
      },
    });

    render(await SeasonPage({ params: Promise.resolve({ year: "2023" }) }));

    expect(screen.getByTestId("season-header")).toHaveTextContent(
      "SeasonHeader: 2023, 22 rounds"
    );
    expect(screen.getByText("Champion Stats Section")).toBeInTheDocument();
    expect(screen.getByText("Race Results Section")).toBeInTheDocument();
  });

  it("renders error display when data fetching fails", async () => {
    vi.mocked(getSeasonData).mockRejectedValueOnce(
      new Error("Failed to fetch data")
    );

    render(await SeasonPage({ params: Promise.resolve({ year: "2023" }) }));

    expect(screen.getByText("Error: Failed to fetch data")).toBeInTheDocument();
  });
});
