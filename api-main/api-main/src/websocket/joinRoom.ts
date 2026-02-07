// Helpers
import initializeNewUser from './initializeNewUser';
import getBalance from './getBalance';
import getProfile from './getProfile';
import getWorldeGameSettings from './getWordleSettings';
import {
  getWordleDailyStat,
  getWordleInfiniteStat
} from './getWordleStats';
import getGlobalStats from './getGlobalStats';
import getNotifications from './getNotifications';

export default function joinRoom(io, socket, userId){
  socket.join(userId);
  io.to(userId).emit(
    'client-connected-to-userId',
    `Client connected with id ${socket.id} was connected to user ${userId}`
  );
  initializeNewUser(io, socket, userId);
  getNotifications(io, socket, userId);
  getBalance(io, socket, userId);
  getProfile(io, socket, userId);
  getGlobalStats(io, socket, userId);
  getWorldeGameSettings(io, socket, userId);
  getWordleDailyStat(io, socket, userId);
  getWordleInfiniteStat(io, socket, userId);
};
