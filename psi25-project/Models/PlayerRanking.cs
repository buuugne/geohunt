namespace psi25_project.Models;

public class PlayerRanking
{
    public int Id { get; set; }

    public int LeaderboardId { get; set; }
    public Leaderboard Leaderboard { get; set; } = null!;

    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

    public int Rank { get; set; }
    public int TotalScore { get; set; }
}