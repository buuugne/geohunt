import { useEffect, useState } from "react";

// Matches the backend LeaderboardEntry DTO
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string | null;
  totalScore: number;
  distanceKm: number;
  guessedAt: string;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  lastUpdatedAt: string | null;
}

async function fetchLeaderboard(): Promise<LeaderboardData> {
  const res = await fetch("/api/Leaderboard", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const json = await fetchLeaderboard();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, loading, error, refetch: load };
}