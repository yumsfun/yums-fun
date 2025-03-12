'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import PriceChart from '@/components/PriceChart';
import { Token } from '@/firebase/types';
import { Timestamp } from 'firebase/firestore';

// BWIRT token data
const BWIRT_TOKEN_DATA: Token = {
  id: 'bwirt',
  name: 'BWIRT',
  symbol: 'BWIRT',
  logo: '/tokens/bwirt.jpg',
  description: 'bwirt also wants to join this meta',
  marketCap: 4200,
  priceChange24h: 8.3,
  createdAt: new Date('2023-03-10T14:30:00Z'),
  creatorAddress: '9XyPJ7WsYsQF3hGrFqgMrL9LGy7nKeDVM5L3F9WvVJjZ',
  contractAddress: 'BWiRTzh9xFjRJMJvKG5qUHMNXqKxYCxNPDeRjnMz4cF',
  replies: 7
};

export default function BwirtTokenPage() {
  const [buyAmount, setBuyAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format market cap to readable format
  const formatValue = (value: number) => {
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
    } else if (timestamp && typeof timestamp.toDate === 'function') {
      // Firebase Timestamp
      created = timestamp.toDate();
    } else {
      created = new Date();
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };
  
  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyAmount(e.target.value);
  };
  
  const calculateTokenAmount = () => {
    const solAmount = parseFloat(buyAmount) || 0;
    // Mock price calculation
    return (solAmount / 0.0008).toFixed(2);
  };
  
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Token Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-16 w-16 mr-4 rounded-full overflow-hidden bg-navy-400">
              <Image
                src={BWIRT_TOKEN_DATA.logo}
                alt={`${BWIRT_TOKEN_DATA.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{BWIRT_TOKEN_DATA.name}</h1>
              <p className="text-gray-400">${BWIRT_TOKEN_DATA.symbol}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary">
              Buy
            </button>
            <button className="btn btn-outline">
              Add to Watchlist
            </button>
            <button className="btn bg-navy-600 text-white hover:bg-navy-500">
              Share
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart and Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-navy-600 rounded-xl p-6 h-80 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Price Chart</h3>
                <p className="text-gray-400">BWIRT is up {BWIRT_TOKEN_DATA.priceChange24h.toFixed(1)}% in the last 24 hours</p>
                <div className="mt-4 h-40 w-full bg-navy-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-primary text-4xl font-bold">$0.00042</div>
                </div>
              </div>
            </div>
            
            <div className="bg-navy-600 rounded-xl p-4">
              <h3 className="font-bold mb-4">Token Stats</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="font-medium">{formatValue(BWIRT_TOKEN_DATA.marketCap)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">24h Volume</p>
                  <p className="font-medium">{formatValue(BWIRT_TOKEN_DATA.marketCap * 0.3)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Holders</p>
                  <p className="font-medium">128</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">24h Change</p>
                  <p className={`font-medium ${BWIRT_TOKEN_DATA.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {BWIRT_TOKEN_DATA.priceChange24h > 0 ? '+' : ''}{BWIRT_TOKEN_DATA.priceChange24h.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Created</p>
                  <p className="font-medium">{getTimeSinceCreation(BWIRT_TOKEN_DATA.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="bg-navy-600 rounded-xl overflow-hidden">
              <div className="flex border-b border-navy-500">
                <button
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'comments'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('comments')}
                >
                  Comments ({BWIRT_TOKEN_DATA.replies})
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'transactions'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('transactions')}
                >
                  Transactions
                </button>
              </div>
              
              <div className="p-4">
                {activeTab === 'overview' && (
                  <div>
                    <p className="text-gray-300 mb-4">{BWIRT_TOKEN_DATA.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract Address</span>
                        <span className="text-primary">
                          {BWIRT_TOKEN_DATA.contractAddress 
                            ? `${BWIRT_TOKEN_DATA.contractAddress.substring(0, 6)}...${BWIRT_TOKEN_DATA.contractAddress.substring(BWIRT_TOKEN_DATA.contractAddress.length - 4)}`
                            : 'Not available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Creator</span>
                        <span className="text-primary">
                          {BWIRT_TOKEN_DATA.creatorAddress 
                            ? `${BWIRT_TOKEN_DATA.creatorAddress.substring(0, 6)}...${BWIRT_TOKEN_DATA.creatorAddress.substring(BWIRT_TOKEN_DATA.creatorAddress.length - 4)}`
                            : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    <div className="bg-navy-700/50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                          A
                        </div>
                        <div>
                          <p className="text-sm font-medium">Anonymous</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">BWIRT is going to the moon! Just bought a bag 🚀</p>
                    </div>
                    
                    <div className="bg-navy-700/50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                          S
                        </div>
                        <div>
                          <p className="text-sm font-medium">SolTrader</p>
                          <p className="text-xs text-gray-400">5 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">This token has great potential. The community is growing fast!</p>
                    </div>
                    
                    <div className="mt-4">
                      <textarea 
                        className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                        placeholder="Add a comment..."
                        rows={3}
                      ></textarea>
                      <button className="btn btn-primary mt-2">Post Comment</button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'transactions' && (
                  <div className="space-y-3">
                    <div className="bg-navy-700/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-green-500">Buy</p>
                          <p className="text-xs text-gray-400">1 hour ago</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">10,000 BWIRT</p>
                          <p className="text-xs text-gray-400">0.008 SOL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-navy-700/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-green-500">Buy</p>
                          <p className="text-xs text-gray-400">3 hours ago</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">25,000 BWIRT</p>
                          <p className="text-xs text-gray-400">0.02 SOL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-navy-700/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-red-500">Sell</p>
                          <p className="text-xs text-gray-400">5 hours ago</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">5,000 BWIRT</p>
                          <p className="text-xs text-gray-400">0.004 SOL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Buy Panel */}
          <div className="space-y-6">
            <div className="bg-navy-600 rounded-xl p-4">
              <h3 className="font-bold mb-4">Buy {BWIRT_TOKEN_DATA.symbol}</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="buyAmount" className="block text-sm font-medium text-gray-300 mb-1">
                    Amount (SOL)
                  </label>
                  <input
                    type="number"
                    id="buyAmount"
                    value={buyAmount}
                    onChange={handleBuyAmountChange}
                    className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                    placeholder="0.0"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You will receive:</span>
                  <span className="font-medium">{calculateTokenAmount()} {BWIRT_TOKEN_DATA.symbol}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price Impact:</span>
                  <span className="text-green-500">~0.03%</span>
                </div>
                
                <button
                  className="btn btn-primary w-full mt-4"
                  disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                >
                  Buy {BWIRT_TOKEN_DATA.symbol}
                </button>
              </div>
            </div>
            
            <div className="bg-navy-600 rounded-xl p-4">
              <h3 className="font-bold mb-4">Similar Tokens</h3>
              
              <div className="space-y-3">
                <a href="/token/fat-vance" className="flex items-center p-2 hover:bg-navy-500 rounded-lg transition-colors cursor-pointer">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                    <Image src="/tokens/fv.jpg" alt="FAT VANCE logo" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">FAT VANCE</p>
                    <p className="text-xs text-gray-400">$FANCE</p>
                  </div>
                  <div className="text-green-500 text-sm">+15.8%</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 