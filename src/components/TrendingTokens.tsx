'use client';

import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTokensRealtime } from '@/firebase/tokenService';
import { getTokensRealtimeWithFirestore } from '@/firebase/firestoreService';
import { Token } from '@/firebase/types';
import { Timestamp } from 'firebase/firestore';

// Mock tokens array with correct image paths
const MOCK_TOKENS: Token[] = [
  {
    id: 'bwirt',
    name: 'BWIRT',
    symbol: 'BWIRT',
    logo: '/tokens/bwirt.jpg',
    marketCap: 4200000,
    priceChange24h: 8.3,
    createdAt: new Date(),
    creatorAddress: '9XyPJ7WsYsQF3hGrFqgMrL9LGy7nKeDVM5L3F9WvVJjZ',
    replies: 7
  },
  {
    id: 'fat-vance',
    name: 'FAT VANCE',
    symbol: 'FANCE',
    logo: '/tokens/fv.jpg',
    marketCap: 3700000,
    priceChange24h: 15.8,
    createdAt: new Date(),
    creatorAddress: '7nZbHGwzFJ9Dz8uBeRLnmJeBrUVMS8C8YoycjgE3XJ11',
    replies: 12
  },
  {
    id: 'sol',
    name: 'Wrapped SOL',
    symbol: 'SOL',
    logo: '/tokens/sol.png',
    marketCap: 40000000,
    priceChange24h: 2.5,
    createdAt: new Date(),
    creatorAddress: 'So11111111111111111111111111111111111111112',
    replies: 234,
    description: 'Wrapped SOL is the native token of the Solana blockchain wrapped for DeFi applications.',
    contractAddress: 'So11111111111111111111111111111111111111112'
  },
  {
    id: 'bonk',
    name: 'BONK',
    symbol: 'BONK',
    logo: '/tokens/bonk.png',
    marketCap: 5800000,
    priceChange24h: 12.7,
    createdAt: new Date(),
    creatorAddress: '8T4vXWCwJ2JGfVaVVp2Vb2DVJTuuHkzECMgL3nRr2pZ',
    replies: 156,
    description: 'The first Solana dog coin for the people, by the people.',
    contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
  }
];

// Format market cap to readable format
const formatMarketCap = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

// Calculate time since creation
const getTimeSinceCreation = (timestamp: number | Date | Timestamp) => {
  let created: Date;
  
  if (timestamp instanceof Date) {
    created = timestamp;
  } else if (typeof timestamp === 'number') {
    created = new Date(timestamp);
  } else {
    // Timestamp case
    created = (timestamp as Timestamp).toDate();
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
};

const CompactTokenCard: FC<{token: Token; index: number}> = ({ token, index }) => {
  // Determine the correct link path based on token ID
  const tokenPath = `/token/${token.id}`;
    
  return (
    <Link href={tokenPath}>
      <div 
        className={`glass hover:bg-navy-400/50 border border-navy-300/20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer mb-3 transform hover:-translate-y-1 hover:shadow-lg animate-fadeIn relative ${
          token.id === 'bwirt' ? 'before:absolute before:inset-0 before:rounded-xl before:animate-rainbow-border before:z-[-1]' : ''
        }`} 
        style={{ 
          animationDelay: `${index * 100}ms`,
          ...(token.id === 'bwirt' ? { padding: '1px' } : {})
        }}
      >
        <div className={`p-4 rounded-xl ${token.id === 'bwirt' ? 'bg-navy-500' : ''}`}>
          <div className="flex items-center gap-4">
            {/* Token Logo */}
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-navy-400 shadow-md ring-2 ring-primary/20 hover-glow">
              {token.logo ? (
                <Image
                  src={token.logo}
                  alt={`${token.name} logo`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-navy-700 font-bold text-lg">
                  {token.symbol.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Token Name and Symbol */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="font-medium text-white">{token.name}</div>
                  <div className="text-xs text-gray-400">(${token.symbol})</div>
                </div>
                <div className="text-xs text-gray-400">{getTimeSinceCreation(token.createdAt)}</div>
              </div>

              {/* Token Headline */}
              <p className="text-sm text-gray-300 truncate mt-0.5">
                {generateHeadline(token.name, token.symbol, token.priceChange24h)}
              </p>
              
              {/* Token Stats */}
              <div className="flex items-center justify-between text-xs mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">market cap:</span>
                  <span className="text-white font-medium">{formatMarketCap(token.marketCap)}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${token.priceChange24h >= 0 ? 'bg-teal/10 text-teal' : 'bg-red/10 text-red'}`}>
                    {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {token.replies || Math.floor(Math.random() * 50) + 1}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Generate headline based on token name and price change
const generateHeadline = (name: string, symbol: string, priceChange: number) => {
  const headlines = [
    `${name} is ${priceChange > 0 ? 'mooning' : 'dipping'} right now!`,
    `${name} ${priceChange > 0 ? 'gains traction' : 'faces resistance'}`,
    `${symbol} ${priceChange > 0 ? 'breaks out' : 'pulls back'} in the market`,
    `${name} shows ${priceChange > 0 ? 'bullish' : 'bearish'} momentum`,
    `${symbol} ${priceChange > 0 ? 'surges' : 'drops'} ${Math.abs(priceChange).toFixed(1)}%`,
  ];
  
  return headlines[Math.floor(Math.random() * headlines.length)];
};

const TrendingTokens: FC = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [showAnimations, setShowAnimations] = useState(true);
  const [sortType, setSort] = useState('featured');
  const [tokens, setTokens] = useState<Token[]>(MOCK_TOKENS);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Subscribe to real-time token updates
  useEffect(() => {
    // Set loading to false after a short delay to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      // Always use mock tokens
      setTokens(MOCK_TOKENS);
      console.log('Using mock tokens:', MOCK_TOKENS);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Helper function to safely get timestamp as number
  const getTimestampValue = (timestamp: number | Date | Timestamp): number => {
    if (timestamp instanceof Date) {
      return timestamp.getTime();
    } else if (typeof timestamp === 'number') {
      return timestamp;
    } else if (timestamp && typeof timestamp.toDate === 'function') {
      // Firebase Timestamp
      return timestamp.toDate().getTime();
    }
    return 0;
  };
  
  // Handle tag selection
  const handleTagClick = (tag: string) => {
    // If the tag is already selected, deselect it
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      // Simulate loading when changing tags
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  };
  
  // Filter tokens based on selected tag
  const filteredTokens = selectedTag 
    ? tokens.filter(token => {
        const tagLower = selectedTag.toLowerCase();
        return (
          token.name.toLowerCase().includes(tagLower) || 
          token.symbol.toLowerCase().includes(tagLower)
        );
      })
    : tokens;
  
  // Sort tokens based on the selected sort type
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (sortType === 'featured') {
      return b.marketCap - a.marketCap;
    } else if (sortType === 'newest') {
      return getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt);
    } else if (sortType === 'oldest') {
      return getTimestampValue(a.createdAt) - getTimestampValue(b.createdAt);
    } else if (sortType === 'price-high-low') {
      return b.marketCap - a.marketCap;
    } else if (sortType === 'price-low-high') {
      return a.marketCap - b.marketCap;
    }
    return 0;
  });

  // Define trending tags
  const trendingTags = ['popular', 'trending', 'new', 'cat', '1st', 'dog', 'ceo', 'solana', 'ceo killer', 'killer', 'memecoin'];

  return (
    <div>
      <style jsx global>{`
        @keyframes rainbow-border {
          0% { background: linear-gradient(45deg, #ff0000, #ff7300, #00ff00, #0000ff, #ff0000); background-size: 400% 100%; }
          100% { background: linear-gradient(45deg, #ff0000, #ff7300, #00ff00, #0000ff, #ff0000); background-size: 400% 100%; background-position: 100% 50%; }
        }
        
        .animate-rainbow-border {
          animation: rainbow-border 4s linear infinite;
          background-size: 400% 100%;
        }
      `}</style>
      
      {/* Header with tabs and options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
        <div className="flex">
          <button
            className={`px-4 py-1.5 font-medium text-sm transition-colors ${
              activeTab === 'explore'
                ? 'text-primary underline decoration-primary decoration-2 underline-offset-8'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('explore')}
          >
            explore
          </button>
          <button
            className={`px-4 py-1.5 font-medium text-sm transition-colors ${
              activeTab === 'watchlist'
                ? 'text-primary underline decoration-primary decoration-2 underline-offset-8'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('watchlist')}
          >
            watchlist
          </button>
        </div>

        {/* Options */}
        <div className="flex items-center gap-3 text-xs mt-2 sm:mt-0">
          <div className="flex items-center rounded-full bg-navy-400/50 p-1 backdrop-blur-sm">
            <span className="text-gray-400 px-2">sort: {sortType}</span>
            <button className="text-gray-400 bg-navy-500/70 rounded-full h-5 w-5 flex items-center justify-center ml-1 hover:bg-navy-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center rounded-full bg-navy-400/50 p-1 backdrop-blur-sm">
            <span className="text-gray-400 px-2">show animations:</span>
            <button 
              className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300 ${showAnimations ? 'bg-primary text-navy-700' : 'bg-navy-500/70 text-gray-400'}`}
              onClick={() => setShowAnimations(true)}
            >
              on
            </button>
            <button 
              className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300 ${!showAnimations ? 'bg-primary text-navy-700' : 'bg-navy-500/70 text-gray-400'}`}
              onClick={() => setShowAnimations(false)}
            >
              off
            </button>
          </div>
        </div>
      </div>
      
      {/* Trending tags */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
        <span className="text-gray-400 text-sm shrink-0">trending:</span>
        {trendingTags.map((tag, index) => (
          <button
            key={tag}
            className={`px-3 py-1 text-xs ${
              selectedTag === tag 
                ? 'bg-primary text-navy-700 border-primary shadow-md' 
                : 'bg-navy-400/50 hover:bg-navy-400/70 text-white border-navy-300/20'
            } rounded-full shadow-sm border whitespace-nowrap transition-all duration-300 transform hover:-translate-y-0.5 animate-fadeIn`}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
            {selectedTag === tag && (
              <span className="ml-1.5 inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Selected tag indicator */}
      {selectedTag && (
        <div className="mb-4 flex items-center animate-fadeIn">
          <span className="text-sm text-white">Filtering by: </span>
          <span className="ml-2 px-3 py-1 text-xs bg-primary text-navy-700 rounded-full font-medium flex items-center shadow-md">
            {selectedTag}
            <button 
              className="ml-1.5 hover:bg-navy-400/20 rounded-full p-0.5 transition-colors"
              onClick={() => setSelectedTag(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      )}
      
      {/* Token List */}
      <div>
        {loading ? (
          // Loading skeleton with shimmer effect
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-navy-400/30 rounded-xl p-4 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                <div className="flex items-center gap-3 relative">
                  <div className="w-12 h-12 rounded-full bg-navy-500/70"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-navy-500/70 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-navy-500/70 rounded w-full"></div>
                    <div className="h-3 bg-navy-500/70 rounded w-1/2 mt-2"></div>
                  </div>
                  <div className="w-16">
                    <div className="h-4 bg-navy-500/70 rounded mb-2 w-full"></div>
                    <div className="h-3 bg-navy-500/70 rounded w-2/3 ml-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {sortedTokens.length > 0 ? (
              <div className="space-y-3">
                {sortedTokens.map((token, index) => (
                  <CompactTokenCard key={token.id} token={token} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fadeIn">
                <div className="inline-block p-4 rounded-full bg-navy-400/30 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">No tokens found</h2>
                {selectedTag ? (
                  <>
                    <p className="text-gray-400 mb-4">No tokens found matching "{selectedTag}"</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-all duration-300"
                      onClick={() => setSelectedTag(null)}
                    >
                      Clear filter
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 mb-6">
                      Be the first to create a token and start trading!
                    </p>
                    <Link 
                      href="/create" 
                      className="inline-block px-6 py-3 bg-primary text-navy-700 rounded-full font-medium hover:bg-primary-400 transition-all hover:shadow-md"
                    >
                      Create Token
                    </Link>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingTokens; 