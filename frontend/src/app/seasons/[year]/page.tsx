"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import ErrorDisplay from "@/components/error-display";
import NavBar from "@/components/navbar";
import RaceResultsSection from "./components/race-results-section";
import ChampionStatsSection from "./components/champion-stats-section";
import SeasonHeader from "./components/season-header";
import { Flag } from "lucide-react";
import styles from "./page.module.css";
import { ChampionStats, SeasonResult } from "@/types/f1";
import { RaceResult } from "@/types/api";
import apiService, {
  ConstructorStanding,
  DriverStanding,
} from "@/services/api";

const SeasonPage = () => {
  const params = useParams();
  const year = params.year as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seasonData, setSeasonData] = useState<SeasonResult | null>(null);
  const [races, setRaces] = useState<RaceResult[]>([]);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [raceError, setRaceError] = useState<string | null>(null);
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<
    ConstructorStanding[]
  >([]);
  console.log(constructorStandings);
  // Fetch all season data
  useEffect(() => {
    const fetchSeasonData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [, races, driverStandingsData, constructorStandingsData] =
          await Promise.all([
            apiService.getSeason(year),
            apiService.getRaces(year),
            apiService.getDriverStandings(year),
            apiService.getConstructorStandings(year).catch(() => []), // TODO:Handle case where constructor standings are not available
          ]);

        // Get champion from driver standings
        const champion = driverStandingsData[0]?.Driver;
        const championConstructor = driverStandingsData[0]?.Constructors?.[0];

        if (!champion || !championConstructor) {
          throw new Error("Champion data not available");
        }

        setSeasonData({
          season: year,
          champion: {
            givenName: champion.givenName,
            familyName: champion.familyName,
            nationality: champion.nationality,
            constructorName: championConstructor.name,
          },
          rounds: races.length,
        });

        setDriverStandings(driverStandingsData);
        setConstructorStandings(constructorStandingsData);
      } catch (err) {
        console.error("Error fetching season data:", err);
        setError("Failed to load season data");
        setSeasonData(null);
      } finally {
        setLoading(false);
      }
    };

    if (year) {
      fetchSeasonData();
    }
  }, [year]);

  const fetchRaceResults = useCallback(async (season: string) => {
    setLoadingRaces(true);
    setRaceError(null);

    try {
      // First get the races for the season
      const seasonRaces = await apiService.getRaces(season);

      if (seasonRaces.length === 0) {
        setRaceError("No races found for this season");
        return;
      }

      // Then get results for each race
      const resultsPerRound = await Promise.all(
        seasonRaces.map(async (race) => {
          try {
            const results = await apiService.getRaceResults(season, race.round);
            return results.map((result) => ({
              ...result,
              round: race.round,
              raceName: race.raceName,
              date: race.date,
              Circuit: race.Circuit,
            }));
          } catch (err) {
            console.error(
              `Error fetching results for round ${race.round}:`,
              err
            );
            return [];
          }
        })
      );

      const allResults = resultsPerRound.flat();
      if (allResults.length === 0) {
        setRaceError("No race results available for this season");
      } else {
        setRaces(allResults);
      }
    } catch (err) {
      console.error("Error fetching race results:", err);
      setRaceError("Failed to load race results");
    } finally {
      setLoadingRaces(false);
    }
  }, []);

  // Fetch race results when season data is available
  useEffect(() => {
    if (seasonData) {
      fetchRaceResults(year);
    }
  }, [year, seasonData, fetchRaceResults]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!seasonData) return <ErrorDisplay message={`Season ${year} not found`} />;

  // Calculate champion stats from standings
  const championStats: ChampionStats = {
    driver: {
      givenName: seasonData.champion.givenName,
      familyName: seasonData.champion.familyName,
      nationality: seasonData.champion.nationality,
      totalChampionships: 1, // TODO: This could be calculated from historical data
      totalRaceWins: parseInt(driverStandings[0]?.wins || "0"),
      totalPodiums: Math.floor(seasonData.rounds * 0.8), // TODO:This could be calculated from race results
      bestSeason: {
        year: seasonData.season,
        wins: parseInt(driverStandings[0]?.wins || "0"),
        points: parseInt(driverStandings[0]?.points || "0"),
      },
    },
    constructor: {
      name: seasonData.champion.constructorName,
      totalChampionships: 3, // TODO: This could be calculated from historical data
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
