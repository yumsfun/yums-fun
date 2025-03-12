'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const [isConnected, setIsConnected] = useState(false);
  
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>
        
        {isConnected ? (
          <div className="bg-navy-600 rounded-xl p-8">
            {/* Connected Profile Content */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative h-32 w-32 rounded-full overflow-hidden bg-navy-400 shadow-md ring-2 ring-primary/20">
                <div className="w-full h-full flex items-center justify-center bg-primary text-navy-700 font-bold text-4xl">
                  Y
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Yummy User</h2>
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <div className="bg-navy-500 rounded-full px-3 py-1 text-sm text-gray-300 flex items-center">
                    <span className="mr-2">0x7nZb...3XJ11</span>
                    <button className="text-primary hover:text-primary-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Welcome to your profile! Here you can manage your tokens and account settings.
                </p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button className="px-4 py-2 bg-primary text-navy-700 rounded-full font-medium hover:bg-primary-400 transition-all hover:shadow-md">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 bg-navy-400 text-white rounded-full font-medium hover:bg-navy-300 transition-all hover:shadow-md">
                    View Transactions
                  </button>
                  <button 
                    className="px-4 py-2 bg-red/10 text-red rounded-full font-medium hover:bg-red/20 transition-all hover:shadow-md"
                    onClick={() => setIsConnected(false)}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* SOL Balance */}
              <div className="bg-navy-500 hover:bg-navy-400/80 transition-all duration-300 rounded-xl p-6 text-center group relative">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                  <span>0</span>
                  <span className="text-lg">SOL</span>
                </div>
                <div className="text-sm text-gray-300 mt-1">Wallet Balance</div>
                <div className="absolute inset-0 bg-navy-300/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="px-4 py-2 bg-primary/90 text-navy-700 rounded-full text-sm font-medium hover:bg-primary transition-colors">
                    Add Funds
                  </button>
                </div>
              </div>

              {/* Coins Created */}
              <div className="bg-navy-500 hover:bg-navy-400/80 transition-all duration-300 rounded-xl p-6 text-center group">
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-gray-300 mt-1">Coins Created</div>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="text-xs text-gray-400">Most Popular:</div>
                  <div className="text-sm text-gray-300">No coins created yet</div>
                </div>
              </div>

              {/* Coins Held */}
              <div className="bg-navy-500 hover:bg-navy-400/80 transition-all duration-300 rounded-xl p-6 text-center group">
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-gray-300 mt-1">Coins Held</div>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="text-xs text-gray-400">Portfolio Value:</div>
                  <div className="text-sm text-primary-light">0 SOL</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-navy-500 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="text-center text-gray-400 py-6">
                No recent activity to display
              </div>
            </div>
            
            {/* Create Token CTA */}
            <div className="mt-8 bg-navy-500 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to launch your own token?</h3>
              <p className="text-gray-300 mb-4">Create your own token in just a few clicks and start trading!</p>
              <Link 
                href="/create" 
                className="inline-block px-6 py-3 bg-primary text-navy-700 rounded-full font-medium hover:bg-primary-400 transition-all hover:shadow-md"
              >
                Create Token
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-navy-600 rounded-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 rounded-full bg-navy-400/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-6">
                Connect your wallet to view your profile and manage your tokens.
              </p>
              <button 
                onClick={() => setIsConnected(true)}
                className="inline-block px-6 py-3 bg-primary text-navy-700 rounded-full font-medium hover:bg-primary-400 transition-all hover:shadow-md"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 