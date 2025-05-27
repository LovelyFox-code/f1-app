"use client";

import RaceResultsSection from "@/app/seasons/[year]/components/race-results-section";
import { RaceResult } from "@/types/api";

interface ClientRaceResultsSectionProps {
  loading: boolean;
  error: string | null;
  races: RaceResult[];
  champion: {
    givenName: string;
    familyName: string;
  };
}

const ClientRaceResultsSection = (props: ClientRaceResultsSectionProps) => {
  return <RaceResultsSection {...props} />;
};

export default ClientRaceResultsSection;
