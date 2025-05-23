import React from "react";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import styles from "./season-card.module.css";
import { Season } from "@/types/api";

interface SeasonCardProps {
  season: Season;
}

const SeasonCard = ({ season }: SeasonCardProps) => {
  const driver = season.champion;
  console.log("season in season-card", season);
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
              {driver
                ? `${driver.givenName} ${driver.familyName}`
                : "Unavailable"}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Constructor:</span>
            <span className={styles.infoValue}>
              {driver?.constructor ?? "Unavailable"}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Nationality:</span>
            <span className={styles.infoValue}>
              {driver?.nationality ?? "Unavailable"}
            </span>
          </div>
        </div>

        <Link
          href={`/seasons/${season.season}`}
          className={styles.link}
          aria-label={`View details for ${season.season} season`}
        >
          View Details
          <ChevronRight className={styles.linkIcon} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default SeasonCard;
