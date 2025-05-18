import { useState, useEffect } from "react";

interface Champion {
  givenName: string;
  familyName: string;
  constructorName: string;
  nationality: string;
}

interface SeasonResult {
  season: string;
  champion: Champion;
  rounds: number;
}

const useF1Data = () => {
  const [champions, setChampions] = useState<SeasonResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchF1Data = async () => {
    setLoading(true);
    setError(null);

    try {
      // use mock data till the API is available
      const mockChampions: SeasonResult[] = [
        {
          season: "2022",
          champion: {
            givenName: "Max",
            familyName: "Verstappen",
            constructorName: "Red Bull",
            nationality: "Dutch"
          },
          rounds: 22
        },
        {
          season: "2021",
          champion: {
            givenName: "Max",
            familyName: "Verstappen",
            constructorName: "Red Bull",
            nationality: "Dutch"
          },
          rounds: 22
        },
        {
          season: "2020",
          champion: {
            givenName: "Lewis",
            familyName: "Hamilton",
            constructorName: "Mercedes",
            nationality: "British"
          },
          rounds: 17
        },
        {
          season: "2019",
          champion: {
            givenName: "Lewis",
            familyName: "Hamilton",
            constructorName: "Mercedes",
            nationality: "British"
          },
          rounds: 21
        },
        {
          season: "2018",
          champion: {
            givenName: "Lewis",
            familyName: "Hamilton",
            constructorName: "Mercedes",
            nationality: "British"
          },
          rounds: 21
        },
        {
          season: "2017",
          champion: {
            givenName: "Lewis",
            familyName: "Hamilton",
            constructorName: "Mercedes",
            nationality: "British"
          },
          rounds: 20
        },
        {
          season: "2016",
          champion: {
            givenName: "Nico",
            familyName: "Rosberg",
            constructorName: "Mercedes",
            nationality: "German"
          },
          rounds: 21
        },
        {
          season: "2015",
          champion: {
            givenName: "Lewis",
            familyName: "Hamilton",
            constructorName: "Mercedes",
            nationality: "British"
          },
          rounds: 19
        }
      ];

      setChampions(mockChampions);
    } catch (err) {
      setError("Failed to fetch F1 data. Please try again.");
      console.error("Error fetching F1 data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchF1Data();
  }, []);

  return {
    champions,
    loading,
    error,
    refetch: fetchF1Data
  };
};

export default useF1Data; 