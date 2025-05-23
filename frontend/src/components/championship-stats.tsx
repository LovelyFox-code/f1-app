import {
  Award,
  Flag,
  Medal,
  Star,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";
import styles from "./championship-stats.module.css";

interface ChampionshipStats {
  driver: {
    givenName: string;
    familyName: string;
    nationality: string;
    totalChampionships: number;
    totalRaceWins: number;
    totalPodiums: number;
    bestSeason: {
      year: string;
      wins: number;
      points: number;
    };
  };
  constructor: {
    name: string;
    totalChampionships: number;
  };
}

interface ChampionshipStatsProps {
  stats: ChampionshipStats;
}

const ChampionshipStats = ({ stats }: ChampionshipStatsProps) => {
  const { driver, constructor } = stats;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <User className={styles.titleIcon} />
            {driver.givenName} {driver.familyName}
          </h3>
          <p className={styles.nationality}>{driver.nationality}</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statLabel}>
                <Trophy className={styles.statIcon} />
                <span>Championships</span>
              </div>
              <span className={styles.statValue}>
                {driver.totalChampionships}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statLabel}>
                <Flag className={styles.statIcon} />
                <span>Race Wins</span>
              </div>
              <span className={styles.statValue}>{driver.totalRaceWins}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statLabel}>
                <Medal className={styles.statIcon} />
                <span>Podiums</span>
              </div>
              <span className={styles.statValue}>{driver.totalPodiums}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statLabel}>
                <Star className={styles.statIcon} />
                <span>Constructor</span>
              </div>
              <span className={styles.statValueSmall}>{constructor.name}</span>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <div className={styles.bestSeasonHeader}>
            <TrendingUp className={styles.bestSeasonIcon} />
            <span className={styles.bestSeasonLabel}>
              Best Season Performance
            </span>
          </div>

          {driver.bestSeason && (
            <div className={styles.bestSeasonCard}>
              <div className={styles.bestSeasonContent}>
                <div className={styles.bestSeasonYear}>
                  <Medal className={styles.bestSeasonYearIcon} />
                  <span>{driver.bestSeason.year}</span>
                </div>
                <div className={styles.bestSeasonWins}>
                  <Award className={styles.bestSeasonWinsIcon} />
                  <span>{driver.bestSeason.wins} Wins</span>
                </div>
              </div>
              <div className={styles.bestSeasonPoints}>
                {driver.bestSeason.points} Points
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChampionshipStats;
