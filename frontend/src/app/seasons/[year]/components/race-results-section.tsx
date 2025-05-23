import ErrorDisplay from "@/components/error-display";
import LoadingSpinner from "@/components/loading-spinner";
import RaceCard from "@/components/race-card";
import styles from "./race-results-section.module.css";
import { RaceResult } from "@/types/api";

interface RaceResultsSectionProps {
  loading: boolean;
  error: string | null;
  races: RaceResult[];
  champion: {
    givenName: string;
    familyName: string;
  };
}

const RaceResultsSection = ({
  loading,
  error,
  races,
  champion,
}: RaceResultsSectionProps) => {
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
        <ErrorDisplay message={error} />
      </div>
    );
  }

  if (!races || races.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <ErrorDisplay message="No race results available for this season" />
      </div>
    );
  }
  const winners = races.filter((race) => race.position === "1");
  const sortedRaces = winners.slice().sort((a, b) => {
    return Number(a.round) - Number(b.round);
  });
  return (
    <div className={styles.grid}>
      {sortedRaces.map((race) => (
        <RaceCard key={race.id} race={race} champion={champion} />
      ))}
    </div>
  );
};

export default RaceResultsSection;
