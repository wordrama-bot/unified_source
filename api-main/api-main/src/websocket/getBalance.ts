// Services
import { getCoinBalance } from '../api/v1/economy/coins/coins.service';

export default function getBalance(io, socket, userId){
  socket.on('get-balance', async () => {
    const { data } = await getCoinBalance(userId);
    if (!data) return;
    io.to(userId).emit('balance', data?.coin_count);
  })
}

