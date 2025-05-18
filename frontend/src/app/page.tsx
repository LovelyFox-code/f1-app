"use client";

import { useState } from "react";
import { Trophy, ChevronDown, CalendarDays } from "lucide-react";
import { Button } from "@/components/button";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorDisplay from "@/components/error-display";
import SeasonCard from "@/components/season-card";
import useF1Data from "@/hooks/use-f1-data";
import NavBar from "@/components/navbar";
import { SeasonResult } from "@/types/f1";
import styles from "./page.module.css";

const HomePage = () => {
  const { champions, loading, error, refetch } = useF1Data();
  const [visibleYears, setVisibleYears] = useState(6);

  const handleLoadMore = () => {
    setVisibleYears((prev) => prev + 6);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorDisplay message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <main>
      <NavBar />
      <div className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.title}>
                <Trophy className={styles.titleIcon} />
                Formula 1 World Champions
              </h1>
              <p className={styles.description}>
                Discover Formula 1 World Champions from 2005 to present. Explore
                season details and race results.
              </p>
            </div>
            <div className={styles.yearRange}>
              <CalendarDays className={styles.yearRangeIcon} />
              <span className={styles.yearRangeText}>
                {champions.length > 0
                  ? `${champions[0].season} - ${
                      champions[champions.length - 1].season
                    }`
                  : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.grid}>
            {champions.slice(0, visibleYears).map((season: SeasonResult) => (
              <SeasonCard key={season.season} season={season} />
            ))}
          </div>

          {visibleYears < champions.length && (
            <div className={styles.loadMoreContainer}>
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className={styles.loadMoreButton}
              >
                Load More Seasons
                <ChevronDown className={styles.loadMoreIcon} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
