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
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className={styles.grid}>
      {races.map((race) => (
        <RaceCard key={race.round} race={race} champion={champion} />
      ))}
    </div>
  );
};

export default RaceResultsSection;
