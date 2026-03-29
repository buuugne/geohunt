import { Trophy, Medal, Crown, RefreshCw, TrendingUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLeaderboard } from "../hooks/useLeaderboard";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400/20 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30">
        <Crown className="w-5 h-5 text-yellow-400" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-300/20 border-2 border-slate-300 shadow-lg shadow-slate-300/20">
        <Medal className="w-5 h-5 text-slate-300" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-400/20 border-2 border-orange-400 shadow-lg shadow-orange-400/20">
        <Medal className="w-5 h-5 text-orange-400" />
      </div>
    );
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-600">
      <span className="text-sm font-bold text-slate-400">#{rank}</span>
    </div>
  );
}

function rowAccent(rank: number) {
  if (rank === 1) return "border-yellow-400/40 bg-yellow-400/5";
  if (rank === 2) return "border-slate-400/40 bg-slate-400/5";
  if (rank === 3) return "border-orange-400/40 bg-orange-400/5";
  return "border-slate-700 bg-slate-900/40";
}

export default function Leaderboard() {
  const { userId } = useAuth();
  const { data, loading, error, refetch } = useLeaderboard();

  const currentUserRank = data?.entries.find((e) => e.userId === userId)?.rank ?? null;

  if (loading) {
    return (
      <main className="min-h-full text-white flex items-center justify-center px-4 py-15">
        <section className="w-full max-w-2xl">
          <div className="bg-linear-to-r from-slate-800 to-blue-900 rounded-2xl p-10 border-2 border-blue-500 shadow-2xl shadow-blue-900/50 text-center">
            <Trophy className="w-10 h-10 text-blue-300 mx-auto mb-3 animate-pulse" />
            <h1 className="text-2xl font-extrabold tracking-tight text-blue-300 mb-1">
              Loading Leaderboard…
            </h1>
            <p className="text-sm text-blue-200">Fetching global rankings.</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-full text-white flex items-center justify-center px-4 py-15">
        <section className="w-full max-w-2xl">
          <div className="bg-linear-to-r from-slate-800 to-blue-900 rounded-2xl p-10 border-2 border-red-500/60 shadow-2xl text-center">
            <h1 className="text-2xl font-extrabold text-red-300 mb-2">
              Failed to load leaderboard
            </h1>
            <p className="text-sm text-red-200 mb-5">{error}</p>
            <button
              onClick={refetch}
              className="px-5 py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 transition text-white"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  const entries = data?.entries ?? [];

  return (
    <main className="min-h-full text-white px-4 py-10">
      <section className="w-full max-w-3xl mx-auto">
        {/* Header card */}
        <div className="bg-linear-to-r from-slate-800 to-blue-900 rounded-2xl p-8 border-2 border-blue-500 shadow-2xl shadow-blue-900/50 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-linear-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg shadow-yellow-500/30">
                <Trophy className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Global Leaderboard
                </h1>
                <p className="text-sm text-blue-200 mt-0.5">
                  {entries.length} players ranked by total score
                  {data?.lastUpdatedAt && (
                    <span className="ml-2 text-blue-300/60">
                      · Updated{" "}
                      {new Date(data.lastUpdatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-sm font-medium transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Current user's rank summary */}
          {currentUserRank !== null && (
            <div className="mt-5 flex items-center gap-3 bg-blue-500/10 border border-blue-400/30 rounded-xl px-4 py-3">
              <TrendingUp className="w-5 h-5 text-blue-300 shrink-0" />
              <p className="text-sm text-blue-100">
                Your current rank:{" "}
                <span className="font-bold text-white">#{currentUserRank}</span>
                {currentUserRank <= 3 && (
                  <span className="ml-2 text-yellow-400 font-semibold">
                    🏆 Top 3!
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Leaderboard table */}
        {entries.length === 0 ? (
          <div className="bg-linear-to-r from-slate-800 to-blue-900 rounded-2xl p-10 border-2 border-blue-500 shadow-xl text-center">
            <Trophy className="w-10 h-10 text-blue-300/40 mx-auto mb-3" />
            <p className="text-blue-200 font-medium">No players ranked yet.</p>
            <p className="text-sm text-blue-300/60 mt-1">
              Complete a game session to appear on the leaderboard.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const isMe = entry.userId === userId;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition ${rowAccent(entry.rank)} ${
                    isMe ? "ring-2 ring-blue-400/60 ring-offset-1 ring-offset-slate-900" : ""
                  }`}
                >
                  {/* Rank badge */}
                  <RankBadge rank={entry.rank} />

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">
                        {entry.username}
                      </span>
                      {isMe && (
                        <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-medium">
                          You
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div
                      className={`text-lg font-bold ${
                        entry.rank === 1
                          ? "text-yellow-400"
                          : entry.rank === 2
                          ? "text-slate-300"
                          : entry.rank === 3
                          ? "text-orange-400"
                          : "text-green-400"
                      }`}
                    >
                      {entry.totalScore.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-300/60">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}