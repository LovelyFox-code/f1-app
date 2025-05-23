import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./button";
import styles from "./button.module.css";

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });

    // Use real class from CSS module
    expect(button).toHaveClass(styles.button);
    expect(button).toHaveClass(styles.default);
    expect(button).toHaveClass(styles.sizeDefault);
  });

  it("renders with different variants", () => {
    render(<Button variant="outline">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });

    expect(button).toHaveClass(styles.outline);
  });

  it("renders with different sizes", () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });

    expect(button).toHaveClass(styles.sizeLg);
  });

  it("forwards additional props to button element", () => {
    render(<Button data-testid="custom-button">Text</Button>);
    const button = screen.getByTestId("custom-button");
    expect(button).toBeInTheDocument();
  });
});
