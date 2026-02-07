"use client"
//import { useAuth } from '@/providers/auth-provider';
import { useEffect, useRef, useState } from 'react';
//import { useParams } from 'next/navigation';
//import base64 from 'base-64';

function Play() {  
/*   async function handleGetCustomGame() {
    try {
      const { data, ...resp } = await get(`/api/v1/games/wordle/customs/${shareCode}`);
      if (resp.status === 200) {
        localStorage.setItem(
          shareCode,
          base64.encode(JSON.stringify({
            customWord: data.custom_word,
            hint: data.hint
          }))
        );
        setFrameUrl(`${window.location.protocol}//${window.location.host}/wordlegame/index.html?cgid=${shareCode}`);
        setGameReady(true);
      }
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!shareCode) setGameReady(true);
    else handleGetCustomGame();
  }, [shareCode]); */
}

export default function PlaySpellBeeInfinitePage() {
  const ref = useRef();
  //const { shareCode } = useParams();
  //const [gameReady, setGameReady] = useState(false);
  const [frameUrl, setFrameUrl] = useState(`${window.location.protocol}//${window.location.host}/spellbeegame/infinite/index.html`);
  //{ !loading && gameReady && ( )}
  return (
    <div className="min-h-screen">
      <iframe
        s//@ts-ignore
        ref={ref}
        id="gameFrame"
        src={frameUrl}
        width="100%"
        style={{
          display: "block",
          border: "none", 
          height: "95vh",
          width: "99vw",
          overflow: "auto",
        }}
      ></iframe>
    </div>
  )
}
