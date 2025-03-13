'use client';

import { useEffect } from 'react';

export default function TokenDiscoveryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log('TokenDiscoveryProvider: Initializing worker...');
    // Initialize the token discovery worker
    const worker = new Worker(
      new URL('../workers/tokenDiscoveryWorker.ts', import.meta.url)
    );

    worker.onmessage = (event) => {
      console.log('TokenDiscoveryProvider: Received message from worker:', event.data);
    };

    worker.onerror = (error) => {
      console.error('TokenDiscoveryProvider: Worker error:', error);
    };

    return () => {
      console.log('TokenDiscoveryProvider: Terminating worker...');
      worker.terminate();
    };
  }, []);

  return <>{children}</>;
} 