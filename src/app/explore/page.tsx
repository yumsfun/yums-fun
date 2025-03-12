'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TokenCard from '@/components/TokenCard';
import Link from 'next/link';

// Define token type
interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  marketCap: number;
  priceChange24h: number;
  createdAt: string;
  creatorAddress: string;
  category?: string;
}

// Empty tokens array - we'll fetch real tokens from the database later
const MOCK_TOKENS: Token[] = [];

// Categories for filtering
const CATEGORIES = [
  'All',
  'Popular',
  'Trending',
  'New',
];

// Sort options
const SORT_OPTIONS = [
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'priceChange24h', label: 'Price Change' },
  { value: 'createdAt', label: 'Newest' },
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filter and sort tokens
  const filteredTokens = MOCK_TOKENS.filter(token => {
    // Filter by search term
    const matchesSearch = 
      token.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = 
      selectedCategory === 'All' || token.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort by selected criteria
    if (sortBy === 'marketCap') {
      return sortOrder === 'asc' ? a.marketCap - b.marketCap : b.marketCap - a.marketCap;
    } else if (sortBy === 'priceChange24h') {
      return sortOrder === 'asc' ? a.priceChange24h - b.priceChange24h : b.priceChange24h - a.priceChange24h;
    } else { // createdAt
      return sortOrder === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Explore Tokens</h1>
        
        {/* Search and Filters */}
        <div className="bg-navy-600 rounded-xl p-4 mb-8">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-navy-700 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-navy-700'
                      : 'bg-navy-700 text-gray-300 hover:bg-navy-500'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-navy-700 border border-navy-500 rounded-lg px-3 py-1 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSortOrder}
                className="bg-navy-700 border border-navy-500 rounded-lg p-1"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-400 transition-transform ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {filteredTokens.length === 0 ? (
          <div className="bg-navy-600 rounded-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 rounded-full bg-navy-400/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">No tokens found</h2>
              <p className="text-gray-300 mb-6">
                Be the first to create a token and start trading!
              </p>
              <Link 
                href="/create" 
                className="inline-block px-6 py-3 bg-primary text-navy-700 rounded-full font-medium hover:bg-primary-400 transition-all hover:shadow-md"
              >
                Create Token
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTokens.map((token) => (
              <TokenCard key={token.id} {...token} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 