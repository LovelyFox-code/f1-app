"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorDisplay from "@/components/error-display";
import useF1Data from "@/hooks/use-f1-data";
import NavBar from "@/components/navbar";
import RaceResultsSection from "./components/race-results-section";
import ChampionStatsSection from "./components/champion-stats-section";
import SeasonHeader from "./components/season-header";
import { Flag } from "lucide-react";
import { RaceResult, SeasonResult, ChampionStats } from "@/types/f1";
import styles from "./page.module.css";

const SeasonPage = () => {
  const params = useParams();
  const year = params.year as string;

  const { champions, loading, error } = useF1Data();
  const [seasonData, setSeasonData] = useState<SeasonResult | null>(null);
  const [races, setRaces] = useState<RaceResult[]>([]);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [raceError, setRaceError] = useState<string | null>(null);

  const fetchRaceData = async (season: string, seasonData: SeasonResult) => {
    setLoadingRaces(true);
    setRaceError(null);

    try {
      setTimeout(() => {
        const mockRaces: RaceResult[] = Array(seasonData.rounds)
          .fill(0)
          .map((_, index) => ({
            round: index + 1,
            raceName: `${season} Grand Prix ${index + 1}`,
            date: `${season}-${(3 + index).toString().padStart(2, "0")}-${(
              5 +
              index * 2
            )
              .toString()
              .padStart(2, "0")}`,
            Circuit: {
              circuitName: `Circuit ${index + 1}`,
              Location: {
                country: [
                  "Italy",
                  "Spain",
                  "Monaco",
                  "UK",
                  "Germany",
                  "France",
                  "Belgium",
                  "Japan",
                  "USA",
                ][index % 9],
              },
            },
            Results: [
              {
                position: "1",
                Driver: {
                  givenName: seasonData.champion.givenName,
                  familyName: seasonData.champion.familyName,
                },
                Constructor: {
                  name: seasonData.champion.constructorName,
                },
              },
            ],
          }));

        setRaces(mockRaces);
        setLoadingRaces(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching race data:", err);
      setRaceError("Failed to load race data");
      setLoadingRaces(false);
    }
  };

  useEffect(() => {
    if (champions.length > 0 && year) {
      const foundSeason = champions.find((s) => s.season === year);
      if (foundSeason) {
        setSeasonData(foundSeason);
        fetchRaceData(year, foundSeason);
      } else {
        setSeasonData(null);
      }
    }
  }, [champions, year]);

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
