using Microsoft.AspNetCore.Mvc;
using psi25_project.Services.Interfaces;
using psi25_project.Models.Dtos;

namespace psi25_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly ILeaderboardService _leaderboardService;

        public LeaderboardController(ILeaderboardService leaderboardService)
        {
            _leaderboardService = leaderboardService;
        }

        [HttpGet("top")]
        public async Task<IActionResult> GetTopPlayers([FromQuery] int top = 20)
        {
            var entries = await _leaderboardService.GetTopPlayersAsync(top);
            return Ok(entries);
        }

        // Called fronto
        [HttpGet]
        public async Task<IActionResult> GetLeaderboard([FromQuery] int top = 20)
        {
            var entries = await _leaderboardService.GetTopPlayersAsync(top);

            var response = new
            {
                Entries = entries,
                LastUpdatedAt = (DateTime?)null
            };

            return Ok(response);
        }

    }
}