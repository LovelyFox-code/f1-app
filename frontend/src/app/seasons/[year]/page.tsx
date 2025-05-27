import React from "react";
import ErrorDisplay from "@/components/error-display";
import ClientNavBar from "@/components/client-navbar";
import ClientRaceResultsSection from "@/components/client-race-results-section";
import ChampionStatsSection from "./components/champion-stats-section";
import SeasonHeader from "./components/season-header";
import { Flag } from "lucide-react";
import styles from "./page.module.css";
import { getSeasonData } from "./season-data";

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
                <h2 className={styles.raceResultsTitle}>
                  <Flag className={styles.raceResultsIcon} />
                  Champions for the season races
                </h2>
              </div>
              <div className={styles.raceResultsContainer}>
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
