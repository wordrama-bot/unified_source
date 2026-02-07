"use client"

import { Snowfall } from 'react-snowfall';
import { useEffect, useState } from 'react';

export default function Snow() {
  const [snowflakeImages, setSnowflakeImages] = useState<CanvasImageSource[]>([]);

  useEffect(() => {
    const img = new Image();
    img.src = 'https://utfs.io/f/vieUBZcrouNZ0v5FzHLACMqpHXiGjag7lSdh82fEZBtPoOnT';
    img.onload = () => setSnowflakeImages([img]); // Load image and set it in state
  }, []);

  return (
    <Snowfall
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
      }}
      snowflakeCount={150}
      radius={[5, 27]}
      images={snowflakeImages}
    />
  )
}
