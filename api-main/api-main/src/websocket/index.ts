import jwt_decode from 'jwt-decode';
import { Server } from 'socket.io';

// Types
import { type UserToken } from '../api/v1/auth/auth.types';

// Helpers
import joinRoom from './joinRoom';

let io

export function init(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.WEBSOCKET_ORIGIN]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) next(new Error('Token missing'));  
    const decodedToken: UserToken = jwt_decode(token);
    if (decodedToken.exp < Math.floor(Date.now() / 1000)) next(new Error('Token expired'));
    socket.userId = decodedToken?.sub;
    console.log(decodedToken?.sub);
    next();
  });

  io.on('connection', async (socket) => {
    joinRoom(io, socket, socket.userId);    
  });

  io.on('disconnect', () => {});
}

export function sendMessage(roomId: string, key: string, message: any) {
  io.to(roomId).emit(key, message);
}
