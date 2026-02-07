// Services
import { getTotalGamesPlayed, getStats as getWordleInfiniteStats } from '../api/v1/games/wordle/stats/stats.service';

export default function getGlobalStats(io, socket, userId){
  socket.on('get-global-stats', async () => {
    const { data: totalGames } = await getTotalGamesPlayed(userId);
    const { data: wordleInfiniteStats } = await getWordleInfiniteStats(userId, 1);
    if (!wordleInfiniteStats) return;

    const data = {
      totalGames,
      wordle: {
        infinite: wordleInfiniteStats
      }
    };

    io.to(userId).emit('global-stats', data);
  });
}
