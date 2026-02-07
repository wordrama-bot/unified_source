// Services
import { getProfile } from '../api/v1/auth/account/account.service';

export default function getUserProfile(io, socket, userId){
  socket.on('get-profile', async () => {
    const { data } = await getProfile(userId);
    if (!data) return;
    io.to(userId).emit('profile', data);
    io.to(userId).emit('xpLevel', {
      xp: data.xp,
      level: data.level,
      xpForNextLevel: data.xp_to_next_level
    });
  })
}

