import { Calendar, Flag, MapPin, Trophy, User } from "lucide-react";
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
    race.Driver?.givenName === champion.givenName &&
    race.Driver?.familyName === champion.familyName;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Flag className={styles.titleIcon} />
          Round {race.round}
        </h3>
        <div className={styles.round}>Position {race.position}</div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <Calendar className={styles.detailIcon} />
          {race.Time?.time ?? "No time recorded"}
        </div>
        <div className={styles.detail}>
          <MapPin className={styles.detailIcon} />
          Grid: {race.grid} | Laps: {race.laps}
        </div>
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
              <User className={styles.winnerNameIcon} />
              <span>
                {race.Driver?.givenName ?? "Unknown"} {race.Driver?.familyName ?? "Driver"}
              </span>
            </div>
            <span className={styles.winnerTeam}>{race.Constructor?.name ?? "Unknown Team"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
