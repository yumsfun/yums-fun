'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  marketCap: number;
  priceChange24h: number;
  address: string;
}

// Our featured tokens that should always be included
const FEATURED_TOKENS = [
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

const HeroSection: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [topToken, setTopToken] = useState<TokenData | null>(null);
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
    
    // Set up pulsing animation with interval
    const pulseInterval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 2000);
    
    // Fetch token data from Solana
    fetchSolanaTokens();
    
    return () => clearInterval(pulseInterval);
  }, []);
  
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
        .map((token: TokenInfo, index: number) => {
          // Mock market cap and price change data
          const marketCap = index === 0 ? 42000000 : (40000000 / (index + 1));
          const priceChange24h = (Math.random() * 20) - 5; // Random between -5% and 15%
          
          return {
            id: token.symbol.toLowerCase(),
            name: token.name,
            symbol: token.symbol,
            logo: token.logoURI || `/tokens/${token.symbol.toLowerCase()}.jpg`,
            marketCap,
            priceChange24h,
            address: token.address
          };
        });
      
      // Combine featured tokens with popular tokens
      const allTokens = [...FEATURED_TOKENS, ...popularTokens];
      
      // Sort by market cap to find top token, ensuring BWIRT is always first
      const sortedTokens = [...allTokens].sort((a, b) => {
        if (a.id === 'bwirt') return -1;
        if (b.id === 'bwirt') return 1;
        return b.marketCap - a.marketCap;
      });
      
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
      
    } catch (error) {
      console.error('Error fetching Solana tokens:', error);
      // Fallback to just our featured tokens if fetch fails
      setTopToken(FEATURED_TOKENS[0]); // BWIRT
      setTrendingTokens(FEATURED_TOKENS);
      setLoading(false);
    }
  };
  
  // Format market cap to readable format
  const formatMarketCap = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };
  
  return (
    <section className="pt-24 pb-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-accent-purple/5 blur-3xl"></div>
        <div className="absolute top-40 right-1/3 w-6 h-6 rounded-full bg-primary animate-float"></div>
        <div className="absolute top-60 left-1/3 w-4 h-4 rounded-full bg-accent-teal/50 animate-float delay-300"></div>
        <div className="absolute bottom-20 right-1/4 w-5 h-5 rounded-full bg-accent-red/50 animate-float delay-200"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Top of the Food Chain Section */}
        <div 
          className={`mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {loading ? (
            <div className="relative h-32 rounded-2xl bg-navy-400/50 animate-pulse"></div>
          ) : topToken && (
            <div className="relative">
              <div className={`absolute inset-0 rounded-2xl bg-primary/20 blur-xl ${isPulsing ? 'scale-105' : 'scale-100'} transition-all duration-1000 ease-in-out`}></div>
              <div className="glass border border-primary/30 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute -inset-1 bg-primary/10 animate-pulse opacity-50 blur-xl rounded-full"></div>
                
                <div className="text-xs uppercase tracking-wider text-primary font-medium mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Top of the Food Chain
                </div>
                
                <Link 
                  href={`/token/${topToken.id}`}
                  className="flex items-center justify-center group"
                >
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full bg-primary blur-md ${isPulsing ? 'scale-110 opacity-70' : 'scale-100 opacity-50'} transition-all duration-1000 ease-in-out`}></div>
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-navy-400 border-2 border-primary shadow-lg group-hover:scale-105 transition-all duration-300">
                      <Image
                        src={topToken.logo}
                        alt={`${topToken.name} logo`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/tokens/default-token.jpg';
                        }}
                      />
                      <div className="absolute -top-1 -right-1">
                        <div className="relative h-6 w-6">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD100" className="w-6 h-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-left">
                    <div className="flex items-center">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">{topToken.name}</h3>
                      <span className="ml-2 text-xs text-gray-400">${topToken.symbol}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-primary">Market Cap:</span>
                      <span className="ml-2 text-sm font-bold text-white">{formatMarketCap(topToken.marketCap)}</span>
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal inline-block">
                      {topToken.priceChange24h > 0 ? '+' : ''}{topToken.priceChange24h.toFixed(1)}%
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Heading */}
        <h1 
          className={`text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Launch your Solana token in seconds
        </h1>
        
        {/* Subheading */}
        <p 
          className={`text-lg text-foreground-secondary mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          The easiest way to create, launch and trade memecoins on Solana with no code required
        </p>
        
        {/* Main CTA */}
        <div 
          className={`mb-12 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Link 
            href="/create" 
            className="btn-modern-primary text-lg py-3 px-8 hover-glow"
          >
            <span className="relative z-10">Create a Token</span>
          </Link>
          
          <Link
            href="/explore"
            className="btn-modern-outline ml-4 text-lg py-3 px-8"
          >
            Explore Tokens
          </Link>
        </div>
        
        {/* Stats */}
        <div 
          className={`flex flex-wrap justify-center gap-8 mb-16 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">42</div>
            <div className="text-sm text-foreground-secondary">Tokens Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">$2.2K</div>
            <div className="text-sm text-foreground-secondary">Trading Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">{Math.floor(Math.random() * 900) + 100}</div>
            <div className="text-sm text-foreground-secondary">Active Users</div>
          </div>
        </div>
        
        {/* Trending Section Title */}
        <div 
          className={`transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block relative">
            <h2 className="text-xl font-medium text-white mb-4 relative z-10">now trending</h2>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -skew-x-12 z-0"></div>
          </div>
        </div>

        {/* Featured Tokens */}
        <div 
          className={`flex flex-wrap justify-center gap-4 mt-6 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {loading ? (
            // Loading placeholders
            Array(2).fill(0).map((_, index) => (
              <div key={index} className="glass rounded-xl p-3 flex items-center gap-3 w-48 h-16 animate-pulse bg-navy-400/50"></div>
            ))
          ) : (
            // Real token data
            trendingTokens.map((token, index) => (
              <Link 
                key={token.id}
                href={`/token/${token.id}`}
                className="glass hover:bg-navy-400/50 border border-navy-300/20 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-navy-400">
                  <Image
                    src={token.logo}
                    alt={`${token.name} logo`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = '/tokens/default-token.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="font-medium text-white">{token.name}</div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">${token.symbol}</span>
                    <span className={`text-xs ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      
      {/* Subtle background effect */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-1/3 h-12 bg-primary/5 blur-3xl rounded-full z-0"></div>
    </section>
  );
};

export default HeroSection; 