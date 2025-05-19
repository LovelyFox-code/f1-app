import type { Metadata } from "next";
import "../styles/variables.css";
import { ThemeProvider } from "@/components/theme-provider";
import styles from "./layout.module.css";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Formula 1 Champions",
  description: "Explore Formula 1 World Champions",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body className={clsx(styles.body, "font-barlow")}>
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
