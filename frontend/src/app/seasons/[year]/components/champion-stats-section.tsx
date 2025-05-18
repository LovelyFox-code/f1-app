import ChampionshipStats from "@/components/championship-stats";
import { championStats } from "@/types/f1";

const ChampionStatsSection = ({ stats }: { stats: typeof championStats }) => (
  <div className="mb-10">
    <ChampionshipStats stats={stats} />
  </div>
);
export default ChampionStatsSection;
