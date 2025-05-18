import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { SeasonResult } from "@/types/f1";
import styles from "./season-card.module.css";

interface SeasonCardProps {
  season: SeasonResult;
}

const SeasonCard = ({ season }: SeasonCardProps) => {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <Calendar className={styles.titleIcon} aria-hidden="true" />
          {season.season}
        </h3>
        <span className={styles.rounds}>{season.rounds} Races</span>
      </header>

      <div className={styles.content}>
        <div className={styles.championInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Champion:</span>
            <span className={styles.infoValue}>
              {season.champion.givenName} {season.champion.familyName}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Constructor:</span>
            <span className={styles.infoValue}>
              {season.champion.constructorName}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Nationality:</span>
            <span className={styles.infoValue}>
              {season.champion.nationality}
            </span>
          </div>
        </div>

        <Link
          href={`/seasons/${season.season}`}
          className={styles.link}
          aria-label={`View details for ${season.season} season`}
        >
          View Season Details
          <ChevronRight className={styles.linkIcon} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default SeasonCard;
