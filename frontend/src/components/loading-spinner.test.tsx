import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingSpinner from "./loading-spinner";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-busy", "true");
    expect(spinner).toHaveAttribute("aria-live", "polite");
  });

  it("applies custom className", () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByRole("status");
    const loaderIcon = spinner.querySelector("svg");

    expect(loaderIcon).toHaveClass("custom-class");
  });
});
