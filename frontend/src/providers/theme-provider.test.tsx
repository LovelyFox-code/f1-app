import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-provider";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Test component that uses the theme
const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("initializes with light theme when no theme in localStorage", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(localStorage.getItem).toHaveBeenCalledWith("f1-theme");
  });

  it("initializes with theme from localStorage", () => {
    localStorageMock.getItem.mockReturnValue("dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  });

  it("updates theme and saves to localStorage", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText("Set Dark").click();
    });

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(localStorage.setItem).toHaveBeenCalledWith("f1-theme", "dark");
  });

  it("throws error when useTheme is used outside ThemeProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useTheme must be inside ThemeProvider");

    consoleError.mockRestore();
  });

  it("applies theme to document root", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText("Set Dark").click();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
}); 