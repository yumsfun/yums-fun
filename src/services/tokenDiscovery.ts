import { Connection, PublicKey } from '@solana/web3.js';
import { ref, set, get } from 'firebase/database';
import { db } from '@/firebase/config';
import { config } from '@/config/env';

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  createdAt: number;
  liquidity?: number;
  volume24h?: number;
  priceUsd?: number;
  source: 'raydium' | 'pump';
}

export class TokenDiscoveryService {
  private connection: Connection;
  private lastCheckTimestamp: number;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl);
    this.lastCheckTimestamp = Date.now();
  }

  private async fetchRaydiumNewTokens(): Promise<TokenInfo[]> {
    try {
      const response = await fetch('https://api.raydium.io/v2/main/pairs');
      const data = await response.json();
      
      return data.data
        .filter((pair: any) => {
          const createdAt = new Date(pair.addedTime).getTime();
          return createdAt > this.lastCheckTimestamp;
        })
        .map((pair: any) => ({
          address: pair.tokenB.mint,
          symbol: pair.tokenB.symbol,
          name: pair.tokenB.name,
          decimals: pair.tokenB.decimals,
          createdAt: new Date(pair.addedTime).getTime(),
          liquidity: pair.liquidity,
          volume24h: pair.volume24h,
          priceUsd: pair.price,
          source: 'raydium' as const
        }));
    } catch (error) {
      console.error('Error fetching from Raydium:', error);
      return [];
    }
  }

  private async fetchPumpNewTokens(): Promise<TokenInfo[]> {
    try {
      const response = await fetch('https://api.pump.fun/tokens/latest');
      const data = await response.json();
      
      return data
        .filter((token: any) => {
          const createdAt = new Date(token.createdAt).getTime();
          return createdAt > this.lastCheckTimestamp;
        })
        .map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          logoURI: token.logoURI,
          createdAt: new Date(token.createdAt).getTime(),
          liquidity: token.liquidity,
          priceUsd: token.price,
          source: 'pump' as const
        }));
    } catch (error) {
      console.error('Error fetching from Pump:', error);
      return [];
    }
  }

  private async saveTokenToDatabase(token: TokenInfo) {
    try {
      const tokenRef = ref(db, `tokens/${token.address}`);
      const existingToken = await get(tokenRef);
      
      if (!existingToken.exists()) {
        await set(tokenRef, {
          ...token,
          discoveredAt: Date.now()
        });
        console.log(`New token saved: ${token.symbol}`);
      }
    } catch (error) {
      console.error('Error saving token to database:', error);
    }
  }

  public async monitorNewTokens() {
    try {
      // Fetch new tokens from both sources
      const [raydiumTokens, pumpTokens] = await Promise.all([
        this.fetchRaydiumNewTokens(),
        this.fetchPumpNewTokens()
      ]);

      // Combine and sort by creation time
      const allNewTokens = [...raydiumTokens, ...pumpTokens]
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter(token => 
          token.liquidity && 
          token.liquidity >= config.tokenDiscovery.minLiquidityUsd
        );

      // Save new tokens to database
      for (const token of allNewTokens) {
        await this.saveTokenToDatabase(token);
      }

      // Update last check timestamp
      this.lastCheckTimestamp = Date.now();

      return allNewTokens;
    } catch (error) {
      console.error('Error monitoring new tokens:', error);
      return [];
    }
  }
} 