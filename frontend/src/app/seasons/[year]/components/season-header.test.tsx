import React from "react";
import { render, screen } from "@testing-library/react";
import SeasonHeader from "./season-header";
import { describe, expect, it, vi } from "vitest";

// Mock next/link to just render children
vi.mock("next/link", () => {
  return {
    default: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe("SeasonHeader", () => {
  it("renders season and rounds correctly", () => {
    render(<SeasonHeader season="2023" rounds={22} />);
    const headerElement = screen.getByRole("heading", { level: 1 });
    expect(headerElement).toHaveTextContent("2023 Formula-1");
    expect(screen.getByText("22 Races")).toBeInTheDocument();
  });

  it("renders back button with correct text", () => {
    render(<SeasonHeader season="2023" rounds={22} />);
    expect(
      screen.getByRole("button", { name: /Back to Champions/i })
    ).toBeInTheDocument();
  });
});
