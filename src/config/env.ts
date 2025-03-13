const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config = {
  firebase: {
    apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    databaseURL: getEnvVar('NEXT_PUBLIC_FIREBASE_DATABASE_URL'),
    projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
    measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
  },
  solana: {
    network: getEnvVar('NEXT_PUBLIC_SOLANA_NETWORK'),
    rpcUrl: getEnvVar('NEXT_PUBLIC_CUSTOM_RPC_URL'),
  },
  tokenDiscovery: {
    interval: parseInt(getEnvVar('NEXT_PUBLIC_TOKEN_DISCOVERY_INTERVAL')),
    maxTokensToDisplay: parseInt(getEnvVar('NEXT_PUBLIC_MAX_TOKENS_TO_DISPLAY')),
    minLiquidityUsd: parseInt(getEnvVar('NEXT_PUBLIC_MIN_LIQUIDITY_USD')),
    enableAutoRefresh: getEnvVar('NEXT_PUBLIC_ENABLE_AUTO_REFRESH') === 'true',
  },
} as const; 