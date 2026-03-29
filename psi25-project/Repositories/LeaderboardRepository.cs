using Microsoft.EntityFrameworkCore;
using psi25_project.Data;
using psi25_project.Models;
using psi25_project.Models.Dtos;
using psi25_project.Repositories.Interfaces;

namespace psi25_project.Repositories
{
    public class LeaderboardRepository : ILeaderboardRepository
    {
        private readonly GeoHuntContext _context;

        public LeaderboardRepository(GeoHuntContext context)
        {
            _context = context;
        }

        // ── Existing (unchanged) ──────────────────────────────────────────────

        public async Task<List<LeaderboardEntry>> GetTopGuessesAsync(int top = 20)
        {
            var entries = await _context.Guesses
                .Include(g => g.Game)
                .ThenInclude(game => game.User)
                .Select(g => new LeaderboardEntry
                {
                    Id = g.Id,
                    DistanceKm = g.DistanceKm,
                    GuessedAt = g.GuessedAt,
                    TotalScore = g.Score,
                    UserId = g.Game.User.Id,
                    Username = g.Game.User.UserName
                })
                .OrderByDescending(x => x.TotalScore)
                .Take(top)
                .ToListAsync();

            entries.Sort();
            for (int i = 0; i < entries.Count; i++)
                entries[i].Rank = i + 1;

            return entries;
        }

        // ── Updated — reads from persistent PlayerRankings ───────────────────

        public async Task<List<LeaderboardEntry>> GetTopPlayersAsync(int top = 20)
        {
            var leaderboard = await _context.Leaderboards
                .Include(l => l.Rankings)
                .ThenInclude(r => r.User)
                .FirstOrDefaultAsync();

            if (leaderboard != null && leaderboard.Rankings.Any())
            {
                return leaderboard.Rankings
                    .OrderBy(r => r.Rank)
                    .Take(top)
                    .Select(r => new LeaderboardEntry
                    {
                        UserId = r.UserId,
                        Username = r.User.UserName,
                        TotalScore = r.TotalScore,
                        Rank = r.Rank
                    })
                    .ToList();
            }

            // No persistent data yet — return empty list
            return [];
        }

        // ── New persistent methods ────────────────────────────────────────────

        public async Task<Leaderboard> GetOrCreateLeaderboardAsync()
        {
            var leaderboard = await _context.Leaderboards
                .Include(l => l.Rankings)
                .FirstOrDefaultAsync();

            if (leaderboard == null)
            {
                leaderboard = new Leaderboard { LastUpdatedAt = DateTime.UtcNow };
                _context.Leaderboards.Add(leaderboard);
                await _context.SaveChangesAsync();
            }

            return leaderboard;
        }

        public async Task UpsertPlayerRankingAsync(int leaderboardId, Guid userId, int totalScore)
        {
            var existing = await _context.PlayerRankings
                .FirstOrDefaultAsync(r => r.LeaderboardId == leaderboardId && r.UserId == userId);

            if (existing == null)
            {
                _context.PlayerRankings.Add(new PlayerRanking
                {
                    LeaderboardId = leaderboardId,
                    UserId = userId,
                    TotalScore = totalScore,
                    Rank = 0  // set by RecalculateRanksAsync
                });
            }
            else
            {
                existing.TotalScore = totalScore;
            }

            await _context.SaveChangesAsync();
        }

        public async Task RecalculateRanksAsync(int leaderboardId)
        {
            var rankings = await _context.PlayerRankings
                .Where(r => r.LeaderboardId == leaderboardId)
                .OrderByDescending(r => r.TotalScore)
                .ToListAsync();

            for (int i = 0; i < rankings.Count; i++)
                rankings[i].Rank = i + 1;

            var leaderboard = await _context.Leaderboards.FindAsync(leaderboardId);
            if (leaderboard != null)
                leaderboard.LastUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserTotalScoreAsync(Guid userId, int additionalScore)
        {
            var stats = await _context.UserStats.FindAsync(userId);
            if (stats != null)
            {
                stats.TotalScore += additionalScore;
                await _context.SaveChangesAsync();
            }
        }
    }
}