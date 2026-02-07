import { useState, useEffect } from 'react';

const LoadingPage = () => {
  const messages = [
    "Loading your experience...",
    "Just a moment...",
    "Preparing something special...",
    "Hang tight, we're almost there..."
  ];

  const [message, setMessage] = useState('');

  useEffect(() => {
    const changeMessage = () => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMessage);
    };

    changeMessage();
    const intervalId = setInterval(changeMessage, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="text-lg text-gray-600 mb-4">{message}</div>
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
