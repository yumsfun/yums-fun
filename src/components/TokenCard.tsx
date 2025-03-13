'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { TokenInfo } from '@/services/tokenDiscovery';

interface TokenCardProps {
  token: TokenInfo;
  showSource?: boolean;
}

const TokenCard: FC<TokenCardProps> = ({ token, showSource = false }) => {
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `$${price < 0.01 ? price.toExponential(2) : price.toFixed(2)}`;
  };

  const formatLiquidity = (liquidity?: number) => {
    if (!liquidity) return 'N/A';
    if (liquidity >= 1000000) return `$${(liquidity / 1000000).toFixed(1)}M`;
    if (liquidity >= 1000) return `$${(liquidity / 1000).toFixed(1)}K`;
    return `$${liquidity.toFixed(0)}`;
  };

  return (
    <Link href={`/token/${token.address}`}>
      <div className="bg-navy-600/50 hover:bg-navy-600 transition-all rounded-xl p-6 border border-navy-400/20 hover:border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {token.logoURI ? (
              <Image
                src={token.logoURI}
                alt={token.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {token.symbol[0]}
              </div>
            )}
            <div className="ml-3">
              <h3 className="font-bold">{token.symbol}</h3>
              <p className="text-sm text-gray-400">{token.name}</p>
            </div>
          </div>
          {showSource && (
            <div className={`px-2 py-1 rounded text-xs ${
              token.source === 'raydium' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
            }`}>
              {token.source}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Price</p>
            <p className="font-medium">{formatPrice(token.priceUsd)}</p>
          </div>
          <div>
            <p className="text-gray-400">Liquidity</p>
            <p className="font-medium">{formatLiquidity(token.liquidity)}</p>
          </div>
          <div>
            <p className="text-gray-400">24h Volume</p>
            <p className="font-medium">{formatLiquidity(token.volume24h)}</p>
          </div>
          <div>
            <p className="text-gray-400">Created</p>
            <p className="font-medium">{formatTimeAgo(token.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TokenCard; 