"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type WaitingRoomState = {
  playersOnlineCount: number;
  playersInGamesCount: number;
  activeGameCount: number;
};

type Player = {
  username: string;
  level: number;
  score: number;
};

export default function Game() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [waitingRoomState, setWaitingRoomState] = useState<WaitingRoomState>({
    playersOnlineCount: 0,
    playersInGamesCount: 0,
    activeGameCount: 0,
  });

  const [roomId] = useState('room1');
  const params = useSearchParams();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:4000', {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    const username = params.get('username') || 'Guest';
    const level = Number(params.get('level') || 1);

    socket.emit('joinWaitingRoom', { roomId, username, level });
    socket.emit('joinRoom', { roomId, username, level });

    socket.on('waitingRoom', (waitingRoom: WaitingRoomState) => {
      setWaitingRoomState(waitingRoom);
    });

    socket.on('gameConfig', (config: { playerCount: number; players: Player[] }) => {
      setPlayerCount(config.playerCount);
      setPlayers(config.players);
    });

    socket.on('startGame', (wordFromServer: string) => {
      setWord(wordFromServer);
    });

    socket.on('showResult', (resultFromServer: string) => {
      setResult(resultFromServer);
    });

    socket.on('gameWon', (scores) => {
      console.log('Game Won, Scores:', scores);
    });

    return () => {
      socket.off('waitingRoom');
      socket.off('gameConfig');
      socket.off('startGame');
      socket.off('showResult');
      socket.off('gameWon');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [params, roomId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const playerResult = formData.get('result');

    if (typeof playerResult !== 'string') return;

    socketRef.current?.emit('submitResult', roomId, playerResult);
  };

  const handlePlayAgain = () => {
    socketRef.current?.emit('playAgain', roomId);
  };

  return (
    <div>
      <h1>Word Game</h1>
      <h2>Word: {word}</h2>
      <h3>Player Count: {playerCount}</h3>
      <h3>
        Waiting Room: {waitingRoomState.playersOnlineCount}{' '}
        {waitingRoomState.playersInGamesCount}{' '}
        {waitingRoomState.activeGameCount}
      </h3>
      <h3>Players:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={`${player.username}-${index}`}>
            {player.username} (Level: {player.level}) - Score: {player.score}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input name="result" placeholder="Enter your result" />
        <button type="submit">Submit</button>
      </form>
      <h2>Result: {result}</h2>
      <button type="button" onClick={handlePlayAgain}>
        Play Again
      </button>
    </div>
  );
}