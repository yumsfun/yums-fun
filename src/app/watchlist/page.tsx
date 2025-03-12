'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/Header';
import TokenCard from '@/components/TokenCard';
import Link from 'next/link';

// Mock watchlist data
const MOCK_WATCHLIST = [
  {
    id: 'sol-kitty',
    name: 'Sol Kitty',
    symbol: 'KITTY',
    logo: '/tokens/kity.jpg',
    marketCap: 2500000,
    priceChange24h: 15.2,
    createdAt: '2023-06-15T12:30:00Z',
    creatorAddress: '7nZbHGwzFJ9Dz8uBeRLnmJeBrUVMS8C8YoycjgE3XJ11',
  },
  {
    id: 'pixel-panda',
    name: 'Pixel Panda',
    symbol: 'PANDA',
    logo: '/tokens/panda.jpg',
    marketCap: 750000,
    priceChange24h: 8.3,
    createdAt: '2023-06-25T14:45:00Z',
    creatorAddress: '9XyPJ7WsYsQF3hGrFqgMrL9LGy7nKeDVM5L3F9WvVJjZ',
  },
];

export default function WatchlistPage() {
  const { connected } = useWallet();
  const [watchlist, setWatchlist] = useState(MOCK_WATCHLIST);
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Sort watchlist based on selected criteria
  useEffect(() => {
    const sortedWatchlist = [...watchlist].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'priceChange24h') {
        return sortOrder === 'asc' 
          ? a.priceChange24h - b.priceChange24h 
          : b.priceChange24h - a.priceChange24h;
      } else { // marketCap
        return sortOrder === 'asc' 
          ? a.marketCap - b.marketCap 
          : b.marketCap - a.marketCap;
      }
    });
    
    setWatchlist(sortedWatchlist);
  }, [sortBy, sortOrder]);
  
  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      // Toggle sort order if clicking the same criteria
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new criteria and default to descending order
      setSortBy(criteria);
      setSortOrder('desc');
    }
  };
  
  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(token => token.id !== id));
  };
  
  if (!connected) {
    return (
      <main className="min-h-screen">
        <Header />
        
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <h1 className="text-3xl font-bold text-center mb-8">Your Watchlist</h1>
          
          <div className="bg-navy-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">Please connect your Solana wallet to view your watchlist.</p>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">Your Watchlist</h1>
        
        {watchlist.length === 0 ? (
          <div className="bg-navy-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Your watchlist is empty</h2>
            <p className="text-gray-300 mb-6">
              You haven't added any tokens to your watchlist yet. Explore trending tokens and add them to your watchlist to track their performance.
            </p>
            <Link href="/" className="btn btn-primary">
              Explore Tokens
            </Link>
          </div>
        ) : (
          <>
            {/* Sort Controls */}
            <div className="flex justify-end mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Sort by:</span>
                <button 
                  className={`px-3 py-1 rounded-full ${sortBy === 'marketCap' ? 'bg-primary text-navy' : 'bg-navy-600 text-gray-300'}`}
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap {sortBy === 'marketCap' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`px-3 py-1 rounded-full ${sortBy === 'priceChange24h' ? 'bg-primary text-navy' : 'bg-navy-600 text-gray-300'}`}
                  onClick={() => handleSort('priceChange24h')}
                >
                  Price Change {sortBy === 'priceChange24h' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`px-3 py-1 rounded-full ${sortBy === 'name' ? 'bg-primary text-navy' : 'bg-navy-600 text-gray-300'}`}
                  onClick={() => handleSort('name')}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
            
            {/* Watchlist */}
            <div className="space-y-4">
              {watchlist.map((token) => (
                <div key={token.id} className="relative group">
                  <TokenCard {...token} />
                  <button
                    className="absolute top-2 right-2 bg-navy-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWatchlist(token.id)}
                    title="Remove from watchlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
} 