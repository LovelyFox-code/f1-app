import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SeasonPage from "./page";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useParams: () => ({ year: "2023" }),
}));

vi.mock("@/hooks/use-seasons", () => ({
  useSeasons: () => ({
    data: [
      {
        season: "2023",
        rounds: 22,
        champion: {
          givenName: "Max",
          familyName: "Verstappen",
          nationality: "Dutch",
          constructor: "Red Bull",
        },
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@/hooks/use-season-race-results", () => ({
  useSeasonRaceResults: () => ({
    data: [
      {
        driver: { givenName: "Max", familyName: "Verstappen" },
        position: "1",
        points: "25",
      },
    ],
  }),
}));

// Mock components to avoid rendering issues
vi.mock("@/components/navbar", () => ({
  default: () => <div>Mocked NavBar</div>,
}));
vi.mock("./components/season-header", () => ({
  default: ({ season, rounds }: { season: string; rounds: number }) => (
    <div>{`SeasonHeader: ${season}, ${rounds} rounds`}</div>
  ),
}));
vi.mock("@/components/error-display", () => ({
  default: ({ message }: { message: string }) => (
    <div>{`Error: ${message}`}</div>
  ),
}));
vi.mock("@/components/loading-spinner", () => ({
  default: () => <div>Loading...</div>,
}));

describe("SeasonPage", () => {
  it("renders the season header and champion stats", () => {
    render(<SeasonPage />);

    expect(
      screen.getByText("SeasonHeader: 2023, 22 rounds")
    ).toBeInTheDocument();
    expect(screen.getByText(/Max Verstappen/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Verstappen/i)).toBeInTheDocument();
  });
});
