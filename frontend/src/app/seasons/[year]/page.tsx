"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorDisplay from "@/components/error-display";
import useF1Data from "@/hooks/use-f1-data";
import NavBar from "@/components/navbar";
import RaceResultsSection from "./components/race-results-section";
import ChampionStatsSection from "./components/champion-stats-section";
import SeasonHeader from "./components/season-header";
import { Flag } from "lucide-react";
import styles from "./page.module.css";
import { ChampionStats, SeasonResult } from "@/types/f1";
import { RaceResult } from "@/types/api";

const SeasonPage = () => {
  const params = useParams();
  const year = params.year as string;

  const { champions, loading, error } = useF1Data();
  const [seasonData, setSeasonData] = useState<SeasonResult | null>(null);
  const [races, setRaces] = useState<RaceResult[]>([]);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [raceError, setRaceError] = useState<string | null>(null);

  const fetchRaceData = useCallback((season: string, seasonData: SeasonResult) => {
    setLoadingRaces(true);
    setRaceError(null);

    let timeoutId: NodeJS.Timeout;

    try {
      timeoutId = setTimeout(() => {
        const mockRaces: RaceResult[] = Array(seasonData.rounds)
          .fill(0)
          .map((_, index) => ({
            number: (index + 1).toString(),
            position: "1",
            positionText: "1",
            points: "25",
            round: index + 1,
            Driver: {
              driverId: `driver-${index}`,
              permanentNumber: (index + 1).toString(),
              code: "MOCK",
              givenName: seasonData.champion.givenName,
              familyName: seasonData.champion.familyName,
              dateOfBirth: "1990-01-01",
              nationality: seasonData.champion.nationality,
              id: `driver-${index}`,
              url: `https://example.com/driver-${index}`,
            },
            Constructor: {
              constructorId: `constructor-${index}`,
              name: seasonData.champion.constructorName,
              nationality: "Unknown",
              id: `constructor-${index}`,
              url: `https://example.com/constructor-${index}`,
            },
            grid: "1",
            laps: "50",
            status: "Finished",
            Time: {
              millis: "3600000",
              time: "1:00:00.000",
            },
            FastestLap: {
              rank: "1",
              lap: "30",
              Time: {
                time: "1:30.000",
              },
              AverageSpeed: {
                units: "kph",
                speed: "200",
              },
            },
          }));

        setRaces(mockRaces);
        setLoadingRaces(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching race data:", err);
      setRaceError("Failed to load race data");
      setLoadingRaces(false);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (champions.length > 0 && year) {
      const foundSeason = champions.find((s) => s.season === year);
      if (foundSeason) {
        setSeasonData(foundSeason);
        const cleanup = fetchRaceData(year, foundSeason);
        return cleanup;
      } else {
        setSeasonData(null);
      }
    }
  }, [champions, year, fetchRaceData]);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorDisplay message={error} />;

  if (!seasonData) return <ErrorDisplay message={`Season ${year} not found`} />;

  const championStats: ChampionStats = {
    driver: {
      givenName: seasonData.champion.givenName,
      familyName: seasonData.champion.familyName,
      nationality: seasonData.champion.nationality,
      totalChampionships: 1,
      totalRaceWins: Math.floor(seasonData.rounds * 0.6),
      totalPodiums: Math.floor(seasonData.rounds * 0.8),
      bestSeason: {
        year: seasonData.season,
        wins: Math.floor(seasonData.rounds * 0.6),
        points: Math.floor(seasonData.rounds * 25 * 0.7),
      },
    },
    constructor: {
      name: seasonData.champion.constructorName,
      totalChampionships: 3,
    },
  };

  return (
    <main>
      <NavBar />

      <SeasonHeader season={seasonData.season} rounds={seasonData.rounds} />

      <div className={styles.container}>
        <div className={styles.content}>
          <ChampionStatsSection stats={championStats} />

          <div className={styles.raceResultsSection}>
            <div className={styles.raceResultsHeader}>
              <h2 className={styles.raceResultsTitle}>
                <Flag className={styles.raceResultsIcon} />
                Season Race Results
              </h2>
            </div>

            <div className={styles.raceResultsContainer}>
              <RaceResultsSection
                loading={loadingRaces}
                error={raceError}
                races={races}
                champion={{
                  givenName: seasonData.champion.givenName,
                  familyName: seasonData.champion.familyName,
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
