import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorDisplay from "./error-display";

describe("ErrorDisplay", () => {
  it("renders with default message", () => {
    render(<ErrorDisplay message="Something went wrong" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    const customMessage = "Custom error message";
    render(<ErrorDisplay message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay message="Error occurred" onRetry={onRetry} />);

    const retryButton = screen.getByRole("button", {
      name: /retry loading data/i,
    });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorDisplay message="Error occurred" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    render(<ErrorDisplay message="Error occurred" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });
});
