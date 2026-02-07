"use client"
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function Game() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);

  const [waitingRoomState, setWaitingRoomState] = useState({
    playersOnlineCount: 0,
    playersInGamesCount: 0,
    activeGameCount: 0,
  });
  const [roomId, setRoomId] = useState('room1'); // Example room ID
  const params = useSearchParams();
  params.get('username');
  useEffect(() => {
    const username = params.get('username');
    const level = Number(params.get('level') || 1);
    socket.emit('joinWaitingRoom', {roomId, username, level});
    // Join the game room with username and level
    socket.emit('joinRoom', {roomId, username, level});

    socket.on('waitingRoom', (waitingRoom) => {
      setWaitingRoomState(waitingRoom);
    });

    // Listen for the game config (player count, usernames, levels)
    socket.on('gameConfig', (config) => {
      setPlayerCount(config.playerCount);
      setPlayers(config.players); // Update players info (username, level, score)
    });

    // Listen for the start of the game
    socket.on('startGame', (wordFromServer) => {
      setWord(wordFromServer);
    });

    // Listen for results from both players
    socket.on('showResult', (resultFromServer) => {
      setResult(resultFromServer);
    });

    // Listen for game win event
    socket.on('gameWon', (scores) => {
      console.log('Game Won, Scores:', scores);
    });

    return () => {
      socket.off('gameConfig');
      socket.off('startGame');
      socket.off('showResult');
      socket.off('gameWon');
    };
  }, [roomId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const playerResult = e.target.elements.result.value;
    socket.emit('submitResult', roomId, playerResult);
  };

  const handlePlayAgain = () => {
    socket.emit('playAgain', roomId);
  };

  return (
    <div>
      <h1>Word Game</h1>
      <h2>Word: {word}</h2>
      <h3>Player Count: {playerCount}</h3>
      <h3>Waiting Room: {waitingRoomState.playersOnlineCount} {waitingRoomState.playersInGamesCount} { waitingRoomState.activeGameCount }</h3>
      <h3>Players:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.username} (Level: {player.level}) - Score: {player.score}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input name="result" placeholder="Enter your result" />
        <button type="submit">Submit</button>
      </form>
      <h2>Result: {result}</h2>
      <button onClick={handlePlayAgain}>Play Again</button>
    </div>
  );
}
