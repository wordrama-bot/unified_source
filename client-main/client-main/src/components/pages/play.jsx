import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import base64 from 'base-64';
import useFetch from 'use-http';

import { useAuth } from '../../providers/authProvider';
import { API_BASE_URL } from '../../lib/config';

import NavBar from '../navbar';

export default function Play() {  
  const ref = useRef();
  const { shareCode } = useParams();
  const { session } = useAuth();
  const [gameReady, setGameReady] = useState(false);
  const { get, response, loading, error } = useFetch(API_BASE_URL, {
    headers: {
      Authorization: `${session.token_type} ${session.access_token}`
    }
  });

  const [height, setHeight] = useState("0px");
  const [frameUrl, setFrameUrl] = useState(`${window.location.protocol}//${window.location.host}/wordlegame/index.html`);
  const onLoad = () => {
    setHeight(ref.current.contentWindow.document.body.vi + "px");
  };

  async function handleGetCustomGame() {
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
  }, [shareCode]);

  return (
    <>
      <div className="min-h-screen">
        <NavBar />

        { !loading && gameReady && (
            <iframe
              ref={ref}
              onLoad={onLoad}
              id="gameFrame"
              src={frameUrl}
              width="100%"
              height={height}
              style={{
                display: "block",
                border: "none", 
                height: "89vh",
                width: "100vw",
                overflow: "auto",
              }}
            ></iframe>
          )}
      </div>
    </>
  )
}
