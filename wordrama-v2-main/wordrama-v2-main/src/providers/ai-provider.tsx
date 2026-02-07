import { useEffect, useState } from 'react';
import { useAppInsights } from '../utils/appInsights';

interface AppInsightsProps {
    connectionString?: string;
    children?: React.ReactNode;
}

export default function AppInsights ({ children }: AppInsightsProps) {
  const [activated, setActivated] = useState<boolean>(false);

  useEffect(() => {
    if (!activated) {
      useAppInsights().initAI();
      setActivated(true);
    }
  }, [activated]);

  return (
    <> { children } </>
  );
};
