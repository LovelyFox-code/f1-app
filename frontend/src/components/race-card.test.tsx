import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RaceCard from "./race-card";
import { RaceResult } from "@/types/api";

const mockRace: RaceResult = {
  id: "1",
  round: 1,
  position: "1",
  points: "25",
  grid: "1",
  status: "Finished",
  laps: "58",
  driver: {
    givenName: "Max",
    familyName: "Verstappen",
    nationality: "Dutch",
  },
};

describe("RaceCard", () => {
  it("renders race information correctly", () => {
    render(<RaceCard race={mockRace} />);

    expect(screen.getByText("Round 1")).toBeInTheDocument();
    expect(screen.getByText("Position 1")).toBeInTheDocument();
  });

  it("renders driver information correctly", () => {
    render(<RaceCard race={mockRace} />);

    expect(screen.getByText("Driver:")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("Verstappen")).toBeInTheDocument();
  });
});
