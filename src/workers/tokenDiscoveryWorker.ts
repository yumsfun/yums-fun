import { TokenDiscoveryService } from '@/services/tokenDiscovery';
import { config } from '@/config/env';

console.log('TokenDiscoveryWorker: Starting with config', {
  rpcUrl: config.solana.rpcUrl,
  interval: config.tokenDiscovery.interval,
  autoRefresh: config.tokenDiscovery.enableAutoRefresh,
});

const service = new TokenDiscoveryService(config.solana.rpcUrl);

async function start() {
  try {
    // Initialize service and test Firebase connection
    await service.initialize();
    // Start polling
    await pollForNewTokens();
  } catch (error) {
    console.error('TokenDiscoveryWorker: Failed to start:', error);
    postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function pollForNewTokens() {
  try {
    console.log('TokenDiscoveryWorker: Starting poll...');
    postMessage({ type: 'status', status: 'polling' });

    const newTokens = await service.fetchNewTokens();
    console.log('TokenDiscoveryWorker: Found tokens', {
      count: newTokens.length,
    });
    
    postMessage({
      type: 'tokens',
      tokens: newTokens,
    });

    if (config.tokenDiscovery.enableAutoRefresh) {
      console.log('TokenDiscoveryWorker: Scheduling next poll...');
      postMessage({ type: 'status', status: 'waiting' });
      setTimeout(pollForNewTokens, config.tokenDiscovery.interval);
    } else {
      console.log('TokenDiscoveryWorker: Auto-refresh disabled');
      postMessage({ type: 'status', status: 'disabled' });
    }
  } catch (error) {
    console.error('TokenDiscoveryWorker: Error during poll:', error);
    postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    });

    if (config.tokenDiscovery.enableAutoRefresh) {
      console.log('TokenDiscoveryWorker: Retrying after error...');
      postMessage({ type: 'status', status: 'waiting' });
      setTimeout(pollForNewTokens, config.tokenDiscovery.interval);
    }
  }
}

// Start the worker
start(); 