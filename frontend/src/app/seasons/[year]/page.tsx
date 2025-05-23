"use client";

import { useParams } from "next/navigation";
import ErrorDisplay from "@/components/error-display";
import NavBar from "@/components/navbar";
import RaceResultsSection from "./components/race-results-section";
import ChampionStatsSection from "./components/champion-stats-section";
import SeasonHeader from "./components/season-header";
import { Flag } from "lucide-react";
import styles from "./page.module.css";
import { ChampionStats } from "@/types/api";
import useF1Data from "@/hooks/use-f1-data";
import { useSeasonRaceResults } from "@/hooks/use-season-race-results";

const SeasonPage = () => {
  const params = useParams();
  const year = params.year as string;
  const { champions } = useF1Data();

  const {
    data: raceResults = [],
    isLoading: loading,
    error,
  } = useSeasonRaceResults(year);
  console.log(raceResults[0]);

  const currentSeason = champions.find((c) => c.season === year);
  if (!currentSeason)
    return <ErrorDisplay message={`Season ${year} not found`} />;

  // Calculate champion stats from standings
  const championStats: ChampionStats = {
    driver: {
      givenName: currentSeason.champion.driver.givenName,
      familyName: currentSeason.champion.driver.familyName,
      nationality: currentSeason.champion.driver.nationality,
      totalChampionships: champions.filter(
        (c) =>
          c.champion.driver.givenName ===
            currentSeason.champion.driver.givenName &&
          c.champion.driver.familyName ===
            currentSeason.champion.driver.familyName
      ).length,
      totalRaceWins: raceResults.filter(
        (result) =>
          result.driver.givenName === currentSeason.champion.driver.givenName &&
          result.driver.familyName ===
            currentSeason.champion.driver.familyName &&
          result.position === "1"
      ).length,
      totalPodiums: raceResults.filter(
        (result) =>
          result.driver.givenName === currentSeason.champion.driver.givenName &&
          result.driver.familyName ===
            currentSeason.champion.driver.familyName &&
          ["1", "2", "3"].includes(result.position)
      ).length,
      bestSeason: {
        year: year,
        wins: raceResults.filter(
          (result) =>
            result.driver.givenName ===
              currentSeason.champion.driver.givenName &&
            result.driver.familyName ===
              currentSeason.champion.driver.familyName &&
            result.position === "1"
        ).length,
        points: raceResults
          .filter(
            (result) =>
              result.driver.givenName ===
                currentSeason.champion.driver.givenName &&
              result.driver.familyName ===
                currentSeason.champion.driver.familyName
          )
          .reduce((sum, result) => sum + parseFloat(result.points), 0),
      },
    },
    constructor: {
      name: currentSeason.champion.constructor.name,
      totalChampionships: champions.filter(
        (c) =>
          c.champion.constructor.name ===
          currentSeason.champion.constructor.name
      ).length,
    },
  };

  return (
    <main>
      <NavBar />

      <SeasonHeader
        season={currentSeason.season}
        rounds={currentSeason.rounds}
      />

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
                loading={loading}
                error={error?.message || null}
                races={raceResults}
                champion={{
                  givenName: currentSeason.champion.driver.givenName,
                  familyName: currentSeason.champion.driver.familyName,
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
