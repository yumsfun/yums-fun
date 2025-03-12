'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import PriceChart from '@/components/PriceChart';
import { getTokenById, Token } from '@/firebase/tokenService';

// Fallback token data
const FALLBACK_TOKEN_DATA = {
  id: 'sol-kitty',
  name: 'Sol Kitty',
  symbol: 'KITTY',
  logo: '/tokens/kity.jpg',
  description: 'The cutest memecoin on Solana. Sol Kitty is a community-driven token with a focus on fun and engagement.',
  marketCap: 2500000,
  volume24h: 450000,
  holders: 1250,
  priceChange24h: 15.2,
  createdAt: new Date('2023-06-15T12:30:00Z'),
  creatorAddress: '7nZbHGwzFJ9Dz8uBeRLnmJeBrUVMS8C8YoycjgE3XJ11',
  contractAddress: 'KiTTYzh9xFjRJMJvKG5qUHMNXqKxYCxNPDeRjnMz4cF',
  replies: 0
};

export default function TokenDetailPage() {
  const params = useParams();
  const { id } = params;
  const [buyAmount, setBuyAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchToken = async () => {
      if (typeof id !== 'string') return;
      
      try {
        setLoading(true);
        const tokenData = await getTokenById(id);
        setToken(tokenData);
        setError(null);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to load token data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchToken();
  }, [id]);
  
  // Use token data or fallback
  const tokenData = token || FALLBACK_TOKEN_DATA;
  
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
  const getTimeSinceCreation = (date: Date) => {
    const created = new Date(date);
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
    return (solAmount / 0.005).toFixed(2);
  };
  
  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-navy-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-300">{error}</p>
            <button 
              className="btn btn-primary mt-6"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Token Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-16 w-16 mr-4 rounded-full overflow-hidden bg-navy-400">
              {tokenData.logo ? (
                <Image
                  src={tokenData.logo}
                  alt={`${tokenData.name} logo`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-navy font-bold text-2xl">
                  {tokenData.symbol.charAt(0)}
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{tokenData.name}</h1>
              <p className="text-gray-400">${tokenData.symbol}</p>
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
            <PriceChart tokenId={id as string} />
            
            <div className="bg-navy-600 rounded-xl p-4">
              <h3 className="font-bold mb-4">Token Stats</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="font-medium">{formatValue(tokenData.marketCap)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">24h Volume</p>
                  <p className="font-medium">{formatValue(tokenData.marketCap * 0.2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Holders</p>
                  <p className="font-medium">{Math.floor(tokenData.marketCap / 2000).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">24h Change</p>
                  <p className={`font-medium ${tokenData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {tokenData.priceChange24h > 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Created</p>
                  <p className="font-medium">{getTimeSinceCreation(tokenData.createdAt)}</p>
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
                  Comments
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
                    <p className="text-gray-300 mb-4">{tokenData.description || 'No description available'}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract Address</span>
                        <span className="text-primary">
                          {tokenData.contractAddress 
                            ? `${tokenData.contractAddress.substring(0, 6)}...${tokenData.contractAddress.substring(tokenData.contractAddress.length - 4)}`
                            : 'Not available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Creator</span>
                        <span className="text-primary">
                          {tokenData.creatorAddress 
                            ? `${tokenData.creatorAddress.substring(0, 6)}...${tokenData.creatorAddress.substring(tokenData.creatorAddress.length - 4)}`
                            : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'comments' && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Comments coming soon!</p>
                  </div>
                )}
                
                {activeTab === 'transactions' && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Transaction history coming soon!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Buy Panel */}
          <div className="space-y-6">
            <div className="bg-navy-600 rounded-xl p-4">
              <h3 className="font-bold mb-4">Buy {tokenData.symbol}</h3>
              
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
                  <span className="font-medium">{calculateTokenAmount()} {tokenData.symbol}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price Impact:</span>
                  <span className="text-green-500">~0.05%</span>
                </div>
                
                <button
                  className="btn btn-primary w-full mt-4"
                  disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                >
                  Buy {tokenData.symbol}
                </button>
              </div>
            </div>
            
            <div className="bg-navy-600 rounded-xl p-4">
              <h3 className="font-bold mb-4">Similar Tokens</h3>
              
              <div className="space-y-3">
                {['Moon Doge', 'Pixel Panda', 'Crypto Frog'].map((token, i) => (
                  <div key={i} className="flex items-center p-2 hover:bg-navy-500 rounded-lg transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-navy font-bold text-sm mr-3">
                      {token.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{token}</p>
                      <p className="text-xs text-gray-400">${token.split(' ')[1].toUpperCase()}</p>
                    </div>
                    <div className="text-green-500 text-sm">+{Math.floor(Math.random() * 20)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 