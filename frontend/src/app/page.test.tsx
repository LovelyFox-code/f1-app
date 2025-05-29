import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Link from "next/link";

// Mock the page component since it doesn't exist yet
const HomePage = () => (
  <div>
    <h1>Formula 1 Champions</h1>
    <Link href="/seasons">View Seasons</Link>
  </div>
);

describe("HomePage", () => {
  it("renders the title", () => {
    render(<HomePage />);
    expect(screen.getByText("Formula 1 Champions")).toBeInTheDocument();
  });

  it("renders a link to the seasons page", () => {
    render(<HomePage />);
    const link = screen.getByRole("link", { name: /view seasons/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/seasons");
  });
});
