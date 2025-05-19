"use client";

import { useEffect, useState } from "react";
import { Trophy, ChevronDown, CalendarDays } from "lucide-react";
import { Button } from "@/components/button";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorDisplay from "@/components/error-display";
import SeasonCard from "@/components/season-card";
import useF1Data from "@/hooks/use-f1-data";
import NavBar from "@/components/navbar";
import styles from "./page.module.css";
import { Season } from "@/types/api";
import apiService from "@/services/api";
import { SeasonResult } from "@/types/f1";

const HomePage = () => {
  const { loading, error, refetch } = useF1Data();
  const [visibleSeasons, setVisibleSeasons] = useState(6);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonResults, setSeasonResults] = useState<SeasonResult[]>([]);

  useEffect(() => {
    const fetchSeasonsData = async () => {
      try {
        const seasonsData = await apiService.getSeasons();
        setSeasons(seasonsData);
        const results = await Promise.all(
          seasonsData.map(async (season) => {
            const [champion, races] = await Promise.all([
              apiService.getChampion(season.season),
              apiService.getRaces(season.season),
            ]);

            return {
              season: season.season,
              champion,
              rounds: races.length,
            };
          })
        );
        setSeasonResults(results);
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };
    fetchSeasonsData();
  }, []);

  const handleLoadMore = () => {
    setVisibleSeasons((prev) => prev + 6);
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
                {seasons.length > 0
                  ? `${seasons[0].season} - ${
                      seasons[seasons.length - 1].season
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
            {seasonResults.slice(0, visibleSeasons).map((result) => (
              <SeasonCard key={result.season} season={result} />
            ))}
          </div>

          {visibleSeasons < seasons.length && (
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
