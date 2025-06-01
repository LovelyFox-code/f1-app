import React from "react";
// import { Metadata } from "next";
import { Flag } from "lucide-react";
import ErrorDisplay from "@/components/error-display";
import ClientNavBar from "@/components/client-navbar";
import ClientRaceResultsSection from "@/components/client-race-results-section";
import ChampionStatsSection from "./components/champion-stats-section";
import SeasonHeader from "./components/season-header";

import styles from "./page.module.css";
import { getSeasonData } from "../../../services/season-data";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

const SeasonPage = async ({ params }: PageProps) => {
  try {
    const resolvedParams = await params;
    const { currentSeason, raceResults, championStats } = await getSeasonData(
      resolvedParams.year
    );
    return (
      <main>
        <ClientNavBar />

        <SeasonHeader
          season={resolvedParams.year}
          rounds={currentSeason.rounds}
        />

        <div className={styles.container}>
          <div className={styles.content}>
            <ChampionStatsSection stats={championStats} />
            <div className={styles.raceResultsSection}>
              <div className={styles.raceResultsHeader}>
                <h2 className={styles.raceResultsTitle} id="race-results">
                  <Flag className={styles.raceResultsIcon} aria-hidden="true" />
                  Champions for the season races
                </h2>
              </div>
              <div
                className={styles.raceResultsContainer}
                aria-labelledby="race-results"
              >
                <ClientRaceResultsSection
                  loading={false}
                  error={null}
                  races={raceResults}
                  champion={{
                    givenName: currentSeason.champion.givenName,
                    familyName: currentSeason.champion.familyName,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <ErrorDisplay
        message={
          error instanceof Error
            ? error.message
            : "An error occurred while fetching season data"
        }
      />
    );
  }
};

export default SeasonPage;

// export const generateMetadata = async ({
//   params,
// }: {
//   params: { year: string };
// }): Promise<Metadata> => {
//   const resolvedParams = await Promise.resolve(params);
//   const year = resolvedParams.year;

//   try {
//     const { currentSeason, championStats } = await getSeasonData(year);
//     const { givenName, familyName } = currentSeason.champion;
//     const title = `${year} Formula 1 Season - ${givenName} ${familyName}`;
//     const description = `View the ${year} Formula 1 season results, champion statistics, and race details. ${givenName} ${familyName} won the championship with ${championStats.driver.totalRaceWins} race wins and ${championStats.driver.totalPodiums} podiums.`;
//     return {
//       title,
//       description,
//     };
//   } catch {
//     return {
//       title: `${year} Formula 1 Season`,
//       description: `View the ${year} Formula 1 season results and statistics.`,
//     };
//   }
// };
