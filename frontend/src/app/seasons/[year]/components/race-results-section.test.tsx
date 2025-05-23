import React from "react";
import { render, screen } from "@testing-library/react";
import RaceResultsSection from "./race-results-section";
import { describe, expect, it } from "vitest";

const mockChampion = {
  givenName: "Max",
  familyName: "Verstappen",
};

const mockRaces = [
  {
    id: "3",
    round: 3,
    position: "1",
    raceName: "Race 3",
    points: "25",
    driver: {
      givenName: "Max",
      familyName: "Verstappen",
      nationality: "Dutch",
    },
    grid: "1",
    status: "Finished",
    laps: "58",
  },
  {
    id: "1",
    round: 1,
    position: "1",
    raceName: "Race 1",
    points: "25",
    driver: {
      givenName: "Max",
      familyName: "Verstappen",
      nationality: "Dutch",
    },
    grid: "1",
    status: "Finished",
    laps: "57",
  },
  {
    id: "2",
    round: 2,
    position: "2",
    raceName: "Race 2",
    points: "18",
    driver: {
      givenName: "Lewis",
      familyName: "Hamilton",
      nationality: "British",
    },
    grid: "2",
    status: "Finished",
    laps: "58",
  },
];

describe("RaceResultsSection", () => {
  it("renders loading spinner when loading", () => {
    render(
      <RaceResultsSection
        loading={true}
        error={null}
        races={[]}
        champion={mockChampion}
      />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error message when error", () => {
    render(
      <RaceResultsSection
        loading={false}
        error="Something went wrong"
        races={[]}
        champion={mockChampion}
      />
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("renders no race results message when races empty", () => {
    render(
      <RaceResultsSection
        loading={false}
        error={null}
        races={[]}
        champion={mockChampion}
      />
    );
    expect(
      screen.getByText(/no race results available for this season/i)
    ).toBeInTheDocument();
  });

  it("renders sorted RaceCards for winners only", () => {
    render(
      <RaceResultsSection
        loading={false}
        error={null}
        races={mockRaces}
        champion={mockChampion}
      />
    );
    const raceCards = screen.getAllByText(/Round/i);
    // Only winners rounds 1 and 3 included (Race 2 is position 2)
    expect(raceCards.length).toBe(2);
    expect(raceCards[0]).toHaveTextContent("Round 1");
    expect(raceCards[1]).toHaveTextContent("Round 3");
  });
});
