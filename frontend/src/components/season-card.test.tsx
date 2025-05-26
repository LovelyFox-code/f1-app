import React from "react";
import { render, screen } from "@testing-library/react";
import SeasonCard from "./season-card";
import { describe, expect, it } from "vitest";

const mockSeason = {
  _id: "season-2023",
  season: "2023",
  rounds: 22,
  champion: {
    givenName: "Max",
    familyName: "Verstappen",
    constructorName: "Red Bull",
    nationality: "Dutch",
  },
};

describe("SeasonCard", () => {
  it("renders season title and rounds", () => {
    render(<SeasonCard season={mockSeason} />);
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("22 Races")).toBeInTheDocument();
  });

  it("renders champion information", () => {
    render(<SeasonCard season={mockSeason} />);
    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Red Bull")).toBeInTheDocument();
    expect(screen.getByText("Dutch")).toBeInTheDocument();
  });

  it("renders View Details link", () => {
    render(<SeasonCard season={mockSeason} />);
    const link = screen.getByRole("link", {
      name: /view details for 2023 season/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/seasons/2023");
  });
});
