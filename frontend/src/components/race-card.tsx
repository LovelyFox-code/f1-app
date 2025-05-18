import { Calendar, Flag, MapPin, Trophy, User } from "lucide-react";
import { RaceResult } from "@/types/f1";
import styles from "./race-card.module.css";

interface RaceCardProps {
  race: RaceResult;
  champion?: {
    givenName: string;
    familyName: string;
  };
}

const RaceCard = ({ race, champion }: RaceCardProps) => {
  const winner = race.Results[0];
  const isChampion =
    champion &&
    winner.Driver.givenName === champion.givenName &&
    winner.Driver.familyName === champion.familyName;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Flag className={styles.titleIcon} />
          {race.raceName}
        </h3>
        <div className={styles.round}>Round {race.round}</div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <Calendar className={styles.detailIcon} />
          {new Date(race.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className={styles.detail}>
          <MapPin className={styles.detailIcon} />
          {race.Circuit.circuitName}, {race.Circuit.Location.country}
        </div>
      </div>

      <div className={styles.divider}>
        <div
          className={`${styles.winner} ${isChampion ? styles.champion : ""}`}
        >
          <div className={styles.winnerLabel}>
            <Trophy className={styles.winnerIcon} />
            <span>Winner:</span>
          </div>
          <div className={styles.winnerInfo}>
            <div className={styles.winnerName}>
              <User className={styles.winnerNameIcon} />
              <span>
                {winner.Driver.givenName} {winner.Driver.familyName}
              </span>
            </div>
            <span className={styles.winnerTeam}>{winner.Constructor.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
