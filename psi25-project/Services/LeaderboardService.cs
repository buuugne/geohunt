using psi25_project.Models.Dtos;
using psi25_project.Repositories.Interfaces;
using psi25_project.Services.Interfaces;

namespace psi25_project.Services
{
    public class LeaderboardService : ILeaderboardService
    {
        private readonly ILeaderboardRepository _repository;

        public LeaderboardService(ILeaderboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<LeaderboardEntry>> GetTopLeaderboardAsync(int top = 20)
        {
            return await _repository.GetTopGuessesAsync(top);
        }

        public async Task<List<LeaderboardEntry>> GetTopPlayersAsync(int top = 20)
        {
            return await _repository.GetTopPlayersAsync(top);
        }

        /// <summary>
        /// Called when a game session finishes.
        /// 1. Increments UserStats.TotalScore for the user.
        /// 2. Gets or creates the single global Leaderboard row.
        /// 3. Upserts the user's PlayerRanking with their new total.
        /// 4. Recalculates all rank positions on the leaderboard.
        /// </summary>
        public async Task UpdatePlayerRankingAsync(Guid userId, int gameScore)
        {
            // 1. Update UserStats.TotalScore
            await _repository.UpdateUserTotalScoreAsync(userId, gameScore);

            // 2. Get or create the global leaderboard
            var leaderboard = await _repository.GetOrCreateLeaderboardAsync();

            // 3. Get the user's current total from their ranking row (or use gameScore as seed)
            var currentRankings = await _repository.GetTopPlayersAsync(int.MaxValue);
            var userEntry = currentRankings.FirstOrDefault(p => p.UserId == userId);
            int updatedTotal = userEntry != null
                ? userEntry.TotalScore + gameScore
                : gameScore;

            await _repository.UpsertPlayerRankingAsync(leaderboard.Id, userId, updatedTotal);

            // 4. Recalculate all ranks
            await _repository.RecalculateRanksAsync(leaderboard.Id);
        }
    }
}