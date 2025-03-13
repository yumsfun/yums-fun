import { useState, useEffect } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  marketCap: number;
  priceChange24h: number;
  address: string;
}

// Featured tokens with stable data
export const FEATURED_TOKENS: TokenData[] = [
  {
    id: 'bwirt',
    name: 'BWIRT',
    symbol: 'BWIRT',
    logo: '/tokens/bwirt.jpg',
    marketCap: 4200,
    priceChange24h: 8.3,
    address: '9XyPJ7WsYsQF3hGrFqgMrL9LGy7nKeDVM5L3F9WvVJjZ'
  },
  {
    id: 'fat-vance',
    name: 'FAT VANCE',
    symbol: 'FANCE',
    logo: '/tokens/fv.jpg',
    marketCap: 3700,
    priceChange24h: 15.8,
    address: '7nZbHGwzFJ9Dz8uBeRLnmJeBrUVMS8C8YoycjgE3XJ11'
  }
];

export function useTokenStats() {
  const [topToken, setTopToken] = useState<TokenData>(FEATURED_TOKENS[0]);
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>(FEATURED_TOKENS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSolanaTokens = async () => {
      try {
        // Initialize connection to Solana
        const connection = new Connection(clusterApiUrl('mainnet-beta'));
        
        // Get token list from Solana token registry
        const tokenListProvider = new TokenListProvider();
        const tokenList = await tokenListProvider.resolve();
        const tokenListData = tokenList.filterByClusterSlug('mainnet-beta').getList();
        
        // Popular Solana tokens to include
        const popularTokenAddresses = [
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          'So11111111111111111111111111111111111111112',  // Wrapped SOL
          'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
        ];
        
        // Filter for popular tokens and add market data
        const popularTokens = tokenListData
          .filter((token: TokenInfo) => popularTokenAddresses.includes(token.address))
          .map((token: TokenInfo, index: number) => ({
            id: token.symbol.toLowerCase(),
            name: token.name,
            symbol: token.symbol,
            logo: token.logoURI || `/tokens/${token.symbol.toLowerCase()}.jpg`,
            marketCap: index === 0 ? 42000000 : (40000000 / (index + 1)),
            priceChange24h: 5.0, // Fixed value to avoid hydration issues
            address: token.address
          }));
        
        // Combine featured tokens with popular tokens
        const allTokens = [...FEATURED_TOKENS, ...popularTokens];
        
        // Sort by market cap to find top token, ensuring BWIRT is always first
        const sortedTokens = [...allTokens].sort((a, b) => {
          if (a.id === 'bwirt') return -1;
          if (b.id === 'bwirt') return 1;
          return b.marketCap - a.marketCap;
        });
        
        if (mounted) {
          // Set top token (BWIRT) and trending tokens
          setTopToken(sortedTokens[0]);
          
          // Ensure FANCE is always second in trending list
          const trendingList = [sortedTokens[0]];
          const fanceToken = sortedTokens.find(t => t.id === 'fat-vance');
          if (fanceToken) {
            trendingList.push(fanceToken);
          }
          // Add other popular tokens
          trendingList.push(...sortedTokens.filter(t => 
            t.id !== 'bwirt' && t.id !== 'fat-vance'
          ).slice(0, 2));
          
          setTrendingTokens(trendingList);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Solana tokens:', error);
        if (mounted) {
          // Fallback to just our featured tokens if fetch fails
          setTopToken(FEATURED_TOKENS[0]); // BWIRT
          setTrendingTokens(FEATURED_TOKENS);
          setLoading(false);
        }
      }
    };

    fetchSolanaTokens();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    topToken,
    trendingTokens,
    loading
  };
} 