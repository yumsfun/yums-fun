'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface TokenCardProps {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  marketCap: number;
  priceChange24h: number;
  createdAt: string;
  creatorAddress: string;
}

const TokenCard: FC<TokenCardProps> = ({
  id,
  name,
  symbol,
  logo,
  marketCap,
  priceChange24h,
  createdAt,
  creatorAddress,
}) => {
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
  const getTimeSinceCreation = (dateString: string) => {
    const created = new Date(dateString);
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
  
  // Generate headline based on token name and price change
  const generateHeadline = () => {
    const headlines = [
      `${name} is ${priceChange24h > 0 ? 'mooning' : 'dipping'} right now!`,
      `${name} ${priceChange24h > 0 ? 'gains traction' : 'faces resistance'}`,
      `${symbol} ${priceChange24h > 0 ? 'breaks out' : 'pulls back'} in the market`,
      `${name} shows ${priceChange24h > 0 ? 'bullish' : 'bearish'} momentum`,
      `${symbol} ${priceChange24h > 0 ? 'surges' : 'drops'} ${Math.abs(priceChange24h).toFixed(1)}%`,
    ];
    
    return headlines[Math.floor(Math.random() * headlines.length)];
  };
  
  // Get random number of comments
  const getCommentCount = () => {
    return Math.floor(Math.random() * 50) + 1;
  };

  return (
    <Link href={`/token/${id}`}>
      <div className="bg-navy-400/30 hover:bg-navy-400/50 border border-navy-300/20 rounded-xl transition-all duration-200 cursor-pointer mb-3 p-4">
        <div className="flex items-center gap-4">
          {/* Token Logo */}
          <div className="flex-shrink-0">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-navy-400 shadow-md">
              {logo ? (
                <Image
                  src={logo}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-navy-700 font-bold text-lg">
                  {symbol.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          {/* Token Info - Middle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-white truncate">{name}</h3>
              <span className="text-gray-400 text-sm">(${symbol})</span>
              <span className="text-gray-500 text-xs">•</span>
              <span className="text-gray-400 text-xs">{getTimeSinceCreation(createdAt)}</span>
            </div>
            
            <p className="text-sm text-gray-300 truncate">{generateHeadline()}</p>
            
            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">market cap:</span>
                <span className="text-white font-medium">{formatMarketCap(marketCap)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-gray-400">replies:</span>
                <span className="text-white font-medium">{getCommentCount()}</span>
              </div>
            </div>
          </div>
          
          {/* Market Data - Right */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${priceChange24h >= 0 ? 'bg-teal/10 text-teal' : 'bg-red/10 text-red'}`}>
              {priceChange24h > 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
            </div>
            
            <div className="text-xs text-gray-500 truncate max-w-[120px] mt-1">
              {creatorAddress.slice(0, 4)}...{creatorAddress.slice(-4)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TokenCard; 