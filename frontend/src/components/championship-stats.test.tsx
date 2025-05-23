import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChampionshipStats from "./championship-stats";

const mockStats = {
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
};

describe("ChampionshipStats", () => {
  it("renders driver information correctly", () => {
    render(<ChampionshipStats stats={mockStats} />);

    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Dutch")).toBeInTheDocument();
  });

  it("renders driver statistics correctly", () => {
    render(<ChampionshipStats stats={mockStats} />);

    expect(screen.getByText("Championships")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("Race Wins")).toBeInTheDocument();
    expect(screen.getByText("54")).toBeInTheDocument();

    expect(screen.getByText("Podiums")).toBeInTheDocument();
    expect(screen.getByText("98")).toBeInTheDocument();
  });

  it("renders constructor information correctly", () => {
    render(<ChampionshipStats stats={mockStats} />);

    expect(screen.getByText("Constructor")).toBeInTheDocument();
    expect(screen.getByText("Red Bull Racing")).toBeInTheDocument();
  });

  it("renders best season information correctly", () => {
    render(<ChampionshipStats stats={mockStats} />);

    expect(screen.getByText("Best Season Performance")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("19 Wins")).toBeInTheDocument();
    expect(screen.getByText("575 Points")).toBeInTheDocument();
  });
});
