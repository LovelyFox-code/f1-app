"use client";

import React from "react";
import { useParams } from "next/navigation";
import ErrorDisplay from "@/components/error-display";
import NavBar from "@/components/navbar";
import RaceResultsSection from "./components/race-results-section";
import ChampionStatsSection from "./components/champion-stats-section";
import SeasonHeader from "./components/season-header";
import { Flag } from "lucide-react";
import styles from "./page.module.css";
import { ChampionStats } from "@/types/api";
import { useSeasonRaceResults } from "@/hooks/use-season-race-results";
import { useSeasons } from "@/hooks/use-seasons";
import LoadingSpinner from "@/components/loading-spinner";

const SeasonPage = () => {
  const params = useParams();
  const year = params.year as string;

  const { data: seasons = [], isLoading, error } = useSeasons();
  const { data: raceResults = [] } = useSeasonRaceResults(year);

  const currentSeason = seasons.find((s) => s.season === year);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message="Failed to load season data" />;
  if (!currentSeason)
    return <ErrorDisplay message={`Season ${year} not found`} />;

  const champion = currentSeason.champion;
  const driver = champion;

  const championStats: ChampionStats = {
    driver: {
      givenName: driver.givenName,
      familyName: driver.familyName,
      nationality: driver.nationality,
      totalChampionships: seasons.filter(
        (s) =>
          s.champion.givenName === driver.givenName &&
          s.champion.familyName === driver.familyName
      ).length,
      totalRaceWins: raceResults.filter(
        (result) =>
          result.driver.givenName === driver.givenName &&
          result.driver.familyName === driver.familyName &&
          result.position === "1"
      ).length,
      totalPodiums: raceResults.filter(
        (result) =>
          result.driver.givenName === driver.givenName &&
          result.driver.familyName === driver.familyName &&
          ["1", "2", "3"].includes(result.position)
      ).length,
      bestSeason: {
        year,
        wins: raceResults.filter(
          (result) =>
            result.driver.givenName === driver.givenName &&
            result.driver.familyName === driver.familyName &&
            result.position === "1"
        ).length,
        points: raceResults
          .filter(
            (result) =>
              result.driver.givenName === driver.givenName &&
              result.driver.familyName === driver.familyName
          )
          .reduce((sum, result) => sum + parseFloat(result.points), 0),
      },
    },
    constructor: {
      name: champion.constructor,
      totalChampionships: seasons.filter(
        (s) => s.champion.constructor === champion.constructor
      ).length,
    },
  };

  return (
    <main>
      <NavBar />

      <SeasonHeader season={year} rounds={currentSeason.rounds} />

      <div className={styles.container}>
        <div className={styles.content}>
          <ChampionStatsSection stats={championStats} />
          <div className={styles.raceResultsSection}>
            <div className={styles.raceResultsHeader}>
              <h2 className={styles.raceResultsTitle}>
                <Flag className={styles.raceResultsIcon} />
                Champions for the season races
              </h2>
            </div>

            <div className={styles.raceResultsContainer}>
              <RaceResultsSection
                loading={isLoading}
                error={error || null}
                races={raceResults}
                champion={{
                  givenName: driver.givenName,
                  familyName: driver.familyName,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeasonPage;
