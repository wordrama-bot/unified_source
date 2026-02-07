import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
//import { getAppInsights } from '@/utils/appInsights';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Custom fallback component
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  //getAppInsights().trackException({ error });
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4 text-white-600">Something went wrong!</h1>
      <p className="text-lg mb-4">{error.message}</p>
      {/* <Image
        className='flex justify-center items-center'
        src="/loading.svg"
        alt="loading"
        width={100}
        height={100}
      /> */}
      <br/>
      <Button onClick={resetErrorBoundary} className="bg-blue-600 text-white hover:bg-blue-500">
        Try again
      </Button>
    </div>
  );
}

// ErrorBoundary wrapper component
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
