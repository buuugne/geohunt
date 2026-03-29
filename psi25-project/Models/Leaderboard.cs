namespace psi25_project.Models;

public class Leaderboard
{
    public int Id { get; set; }
    public DateTime LastUpdatedAt { get; set; }

    public ICollection<PlayerRanking> Rankings { get; set; } = [];
}