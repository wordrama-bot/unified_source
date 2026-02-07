import { useState, useEffect, createContext, useContext } from 'react';
import { io } from 'socket.io-client';

import { useAuth } from "./authProvider";
import { API_BASE_URL } from '../lib/config.js';

const WebSocket = createContext({});
export const useWebSocket = () => useContext(WebSocket);
const UserContext = createContext({});
export const useUser = () => useContext(UserContext);

export default function WebSocketProvider({ children }: { children: any}) {
  const { session, user, loading: authLoading } = useAuth();
  const [socket, setSocket] = useState();
  const [coinBalance, setCoinBalance] = useState(0);
  const [profile, setProfile] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [xpLevel, setXpLevel] = useState({});
  const [
    hasLoadedWordleSettings,
    setHasLoadedWordleSettings
  ] = useState(false);
  const [
    hasLoadedWordleStats,
    setHasLoadedWordleStats
  ] = useState(false);
  const [
    hasLoadedDailyWordleStats,
    setHasLoadedDailyWordleStats
  ] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    else if (!session || !user) return;
    // @ts-ignore
    const newSocket = io(
      API_BASE_URL, 
      { 
        auth: { 
          token: session.access_token 
        }
      }
    );

    // @ts-ignore
    setSocket(newSocket);

    return () => {
      newSocket.close();
      setCoinBalance(0);
      setProfile({});
      setNotifications([]);
      setStats({});
      setXpLevel({});
    }
  }, [authLoading, session, user]);

  useEffect(() => {
    if (!socket) return;
    // @ts-ignore
    socket.on('client-connected-to-userId', () => {
      console.log('client-connected-to-userId')
      // @ts-ignore
      socket.emit('get-balance');
      // @ts-ignore
      socket.emit('get-profile');
      // @ts-ignore
      socket.emit('get-global-stats');
      // @ts-ignore
      socket.emit('get-game-wordle-settings');
      // @ts-ignore
      socket.emit('get-game-wordle-daily-stat');
      // @ts-ignore
      socket.emit('get-game-wordle-stat');
      // @ts-ignore
      socket.emit('get-notifications');
    });

    // @ts-ignore
    socket.on('game-wordle-settings', (data) => {
      if (!hasLoadedWordleSettings) {
        console.log('Loading... Wordle Settings');
        localStorage.setItem('gameMode', data.hard_mode ? 'hard' : 'normal');
        localStorage.setItem('wordLength', data.word_length || 'FIVE');
        localStorage.setItem('theme', data.dark_mode ? 'dark' : 'light');
        if (data.confetti_enabled) {
          localStorage.setItem('confettiEnabled', 'true')
        } else {
          localStorage.removeItem('confettiEnabled');
        }
        if (data.colour_blind) {
          // @ts-ignore
          localStorage.setItem('highContrast', 1);
        } else {
          localStorage.removeItem('highContrast');
        }
        setHasLoadedWordleSettings(true);
      }
    });

    // @ts-ignore
    socket.on('game-wordle-daily-stat', (data) => {
      if (!hasLoadedDailyWordleStats) {
        console.log('Loading... Wordle Daily Stats');
        localStorage.setItem('dailyGameStats', JSON.stringify({
          winDistribution: data.win_distribution,
          gamesFailed: data.games_failed,
          currentStreak: data.current_streak,
          bestStreak: data.best_streak,
          totalGames: data.total_games,
          successRate: data.success_rate
        }));
        setHasLoadedDailyWordleStats(true);
      }
    });
    
    // @ts-ignore
    socket.on('game-wordle-stat', (data) => {
      if (!hasLoadedWordleStats) {
        console.log('Loading... Wordle Stats');
        // @ts-ignore
        const result = data.reduce((acc, {id, ...obj}) => {
          acc[obj.word_length] = {
            winDistribution: obj.win_distribution,
            gamesFailed: obj.games_failed,
            currentStreak: obj.current_streak,
            bestStreak: obj.best_streak,
            totalGames: obj.total_games,
            successRate: obj.success_rate
          };
          return acc;
        }, {});
        localStorage.setItem('gameStats', JSON.stringify(result));
        setHasLoadedWordleStats(true);
      }
    });

    // @ts-ignore
    socket.on('global-stats', (stats) => {
      setStats(stats);
    });

    // @ts-ignore
    socket.on('balance', (balance) => {
      setCoinBalance(balance);
    });

    // @ts-ignore
    socket.on('profile', (profile) => {
      setProfile(profile);
    });

    // @ts-ignore
    socket.on('notifications', (notifications) => {
      setNotifications(notifications);
    });

    // @ts-ignore
    socket.on('xpLevel', (data) => {
      setXpLevel(data);
    });
  }, [socket]);

  return (
    <WebSocket.Provider value={{ socket }}>
      <UserContext.Provider value={{ 
        coinBalance, 
        xpLevel, 
        profile, 
        stats, 
        notifications 
      }}>
          { children }
      </UserContext.Provider>
    </WebSocket.Provider>
  )
}
