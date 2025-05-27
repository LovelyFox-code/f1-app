import { Metadata } from "next";
import { getSeasonData } from "./season-data";

export const generateMetadata = async ({
  params,
}: {
  params: { year: string };
}): Promise<Metadata> => {
  const resolvedParams = await Promise.resolve(params);
  const year = resolvedParams.year;

  try {
    const { currentSeason, championStats } = await getSeasonData(year);
    const { givenName, familyName } = currentSeason.champion;
    const title = `${year} Formula 1 Season - ${givenName} ${familyName}`;
    const description = `View the ${year} Formula 1 season results, champion statistics, and race details. ${givenName} ${familyName} won the championship with ${championStats.driver.totalRaceWins} race wins and ${championStats.driver.totalPodiums} podiums.`;

    return {
      title,
      description,
    };
  } catch {
    return {
      title: `${year} Formula 1 Season`,
      description: `View the ${year} Formula 1 season results and statistics.`,
    };
  }
};
