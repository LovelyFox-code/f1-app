import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "../providers/theme-provider";
import styles from "./theme-toggle.module.css";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label="Toggle theme"
    >
      <Sun className={styles.sun} data-testid="sun-icon" />
      <Moon className={styles.moon} data-testid="moon-icon" />
      <span className={styles.srOnly}>Toggle theme</span>
    </Button>
  );
};

export { ThemeToggle };
