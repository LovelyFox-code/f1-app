import { Flag, Trophy } from "lucide-react";
import { RaceResult } from "@/types/api";
import styles from "./race-card.module.css";

interface RaceCardProps {
  race: RaceResult;
  champion?: {
    givenName: string;
    familyName: string;
  };
}

const RaceCard = ({ race, champion }: RaceCardProps) => {
  const isChampion =
    champion &&
    race.driver?.givenName === champion.givenName &&
    race.driver?.familyName === champion.familyName;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Flag className={styles.titleIcon} />
          Round {race.round}
        </h3>
        <div className={styles.round}>Position {race.position}</div>
      </div>

      <div className={styles.divider}>
        <div
          className={`${styles.winner} ${isChampion ? styles.champion : ""}`}
        >
          <div className={styles.winnerLabel}>
            <Trophy className={styles.winnerIcon} />
            <span>Driver:</span>
          </div>
          <div className={styles.winnerInfo}>
            <div className={styles.winnerName}>
              <span>{race.driver?.givenName ?? "Unknown"}</span>
              <span>{race.driver?.familyName ?? "Driver"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
