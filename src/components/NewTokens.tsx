import { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from '@/firebase/config';
import { config } from '@/config/env';
import { TokenInfo } from '@/services/tokenDiscovery';
import TokenCard from './TokenCard';

export default function NewTokens() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('NewTokens: Setting up Firebase listener...');
    // Create a query for the latest tokens
    const tokensRef = ref(db, 'tokens');
    const tokensQuery = query(
      tokensRef,
      orderByChild('createdAt'),
      limitToLast(config.tokenDiscovery.maxTokensToDisplay)
    );

    console.log('NewTokens: Query configured', {
      maxTokens: config.tokenDiscovery.maxTokensToDisplay
    });

    // Subscribe to real-time updates
    const unsubscribe = onValue(tokensQuery, (snapshot) => {
      console.log('NewTokens: Received Firebase update');
      const tokensData = snapshot.val();
      if (tokensData) {
        console.log('NewTokens: Data received', {
          tokenCount: Object.keys(tokensData).length
        });
        const tokensList = Object.values(tokensData) as TokenInfo[];
        // Sort by creation time, newest first
        tokensList.sort((a, b) => b.createdAt - a.createdAt);
        setTokens(tokensList);
      } else {
        console.log('NewTokens: No tokens data found');
      }
      setLoading(false);
    }, (error) => {
      console.error('NewTokens: Firebase error:', error);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log('NewTokens: Cleaning up Firebase listener');
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-bold mb-6">New Tokens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-navy-600/50 rounded-xl p-6 h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  console.log('NewTokens: Rendering', {
    tokenCount: tokens.length
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">New Tokens</h2>
      {tokens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <TokenCard
              key={token.address}
              token={token}
              showSource={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-navy-600/50 rounded-xl">
          <p className="text-gray-400">No new tokens discovered yet</p>
        </div>
      )}
    </div>
  );
} 