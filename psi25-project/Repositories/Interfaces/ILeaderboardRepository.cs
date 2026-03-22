using psi25_project.Models;
using psi25_project.Models.Dtos;

namespace psi25_project.Repositories.Interfaces
{
    public interface ILeaderboardRepository
    {
        // Existing
        Task<List<LeaderboardEntry>> GetTopGuessesAsync(int top = 20);

        // Updated — reads from persistent PlayerRankings
        Task<List<LeaderboardEntry>> GetTopPlayersAsync(int top = 20);

        // New — persistent leaderboard management
        Task<Leaderboard> GetOrCreateLeaderboardAsync();
        Task UpsertPlayerRankingAsync(int leaderboardId, Guid userId, int totalScore);
        Task RecalculateRanksAsync(int leaderboardId);
        Task UpdateUserTotalScoreAsync(Guid userId, int additionalScore);
    }
}