// Services
import { getStat, getStats } from '../api/v1/games/wordle/stats/stats.service';

export function getWordleDailyStat(io, socket, userId){
  socket.on('get-game-wordle-daily-stat', async () => {
    const { data } = await getStat(userId, 0);
    if (!data) return;
    io.to(userId).emit('game-wordle-daily-stat', data);
  });
}

export function getWordleInfiniteStat(io, socket, userId){
  socket.on('get-game-wordle-stat', async () => {
    const { data } = await getStats(userId, 1);
    if (!data) return;

    io.to(userId).emit('game-wordle-stat', data);
  });
}
