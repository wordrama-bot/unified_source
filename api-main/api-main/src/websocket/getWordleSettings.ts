// Services
import { getSettings } from '../api/v1/games/wordle/settings/settings.service';

export default function getGameSettings(io, socket, userId){
  socket.on('get-game-wordle-settings', async () => {
    const { data } = await getSettings(userId);
    if (!data) return;
    io.to(userId).emit('game-wordle-settings', data);
  })
}
