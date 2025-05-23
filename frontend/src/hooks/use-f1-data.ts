import { useState, useEffect } from "react";
import { SeasonResult } from "@/types/api";

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
            driver: {
              givenName: "Max",
              familyName: "Verstappen",
              nationality: "Dutch"
            },
            constructor: {
              name: "Red Bull"
            }
          },
          rounds: 22
        },
        {
          season: "2021",
          champion: {
            driver: {
              givenName: "Max",
              familyName: "Verstappen",
              nationality: "Dutch"
            },
            constructor: {
              name: "Red Bull"
            }
          },
          rounds: 22
        },
        {
          season: "2020",
          champion: {
            driver: {
              givenName: "Lewis",
              familyName: "Hamilton",
              nationality: "British"
            },
            constructor: {
              name: "Mercedes"
            }
          },
          rounds: 17
        },
        {
          season: "2019",
          champion: {
            driver: {
              givenName: "Lewis",
              familyName: "Hamilton",
              nationality: "British"
            },
            constructor: {
              name: "Mercedes"
            }
          },
          rounds: 21
        },
        {
          season: "2018",
          champion: {
            driver: {
              givenName: "Lewis",
              familyName: "Hamilton",
              nationality: "British"
            },
            constructor: {
              name: "Mercedes"
            }
          },
          rounds: 21
        },
        {
          season: "2017",
          champion: {
            driver: {
              givenName: "Lewis",
              familyName: "Hamilton",
              nationality: "British"
            },
            constructor: {
              name: "Mercedes"
            }
          },
          rounds: 20
        },
        {
          season: "2016",
          champion: {
            driver: {
              givenName: "Nico",
              familyName: "Rosberg",
              nationality: "German"
            },
            constructor: {
              name: "Mercedes"
            }
          },
          rounds: 21
        },
        {
          season: "2015",
          champion: {
            driver: {
              givenName: "Lewis",
              familyName: "Hamilton",
              nationality: "British"
            },
            constructor: {
              name: "Mercedes"
            }
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