import { TokenDiscoveryService } from '@/services/tokenDiscovery';
import { config } from '@/config/env';

const discoveryService = new TokenDiscoveryService(config.solana.rpcUrl);

async function pollNewTokens() {
  try {
    await discoveryService.monitorNewTokens();
  } catch (error) {
    console.error('Error in token discovery worker:', error);
  } finally {
    // Schedule next poll using the configured interval
    setTimeout(pollNewTokens, config.tokenDiscovery.interval);
  }
}

// Start polling if auto-refresh is enabled
if (config.tokenDiscovery.enableAutoRefresh) {
  pollNewTokens();
} 