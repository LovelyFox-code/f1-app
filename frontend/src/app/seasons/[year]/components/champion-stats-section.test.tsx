import React from "react";
import { render, screen } from "@testing-library/react";
import ChampionStatsSection from "./champion-stats-section";
import { describe, it, expect } from "vitest";

const mockStats = {
  driver: {
    givenName: "Lewis",
    familyName: "Hamilton",
    nationality: "British",
    totalChampionships: 7,
    totalRaceWins: 103,
    totalPodiums: 182,
    bestSeason: {
      year: "2020",
      wins: 11,
      points: 347,
    },
  },
  constructor: {
    name: "Mercedes",
    totalChampionships: 8,
  },
};

describe("ChampionStatsSection", () => {
  it("renders the ChampionshipStats component with correct data", () => {
    render(<ChampionStatsSection stats={mockStats} />);

    expect(screen.getByText(/podiums/i)).toBeInTheDocument();
    expect(screen.getByText(/18/)).toBeInTheDocument();
  });
});
