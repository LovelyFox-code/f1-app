import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBar from "./navbar";

// Mock the ThemeToggle component since it's not relevant for these tests
vi.mock("./theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

describe("NavBar", () => {
  it("renders navigation with correct ARIA label", () => {
    render(<NavBar />);
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it("renders logo with correct text and link", () => {
    render(<NavBar />);
    const logoLink = screen.getByRole("link", {
      name: /formula 1 champions home/i,
    });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");

    expect(screen.getByText("F1")).toBeInTheDocument();
    expect(screen.getByText("Champions")).toBeInTheDocument();
  });

  it("renders home navigation link", () => {
    render(<NavBar />);
    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    const homeLink = homeLinks.find(link => link.getAttribute("aria-current") === "page");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("renders theme toggle component", () => {
    render(<NavBar />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
