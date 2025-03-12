import { db } from './config';
import { 
  ref, 
  set,
  push,
  get,
  query,
  orderByChild,
  limitToLast,
  onValue,
  off,
  DataSnapshot
} from 'firebase/database';
import { Token } from './types';

// Collection reference
const tokensRef = ref(db, 'tokens');

// Create a new token
export const createToken = async (tokenData: Omit<Token, 'id' | 'createdAt' | 'replies'>) => {
  try {
    // Create a new reference with an auto-generated ID
    const newTokenRef = push(tokensRef);
    
    const newToken = { 
      ...tokenData, 
      createdAt: Date.now(),
      replies: 0,
      // Ensure these fields are included with defaults if not provided
      initialSupply: tokenData.initialSupply || 1000000,
      taxFee: tokenData.taxFee !== undefined ? tokenData.taxFee : 5
    };
    
    // Set the data at the new reference
    await set(newTokenRef, newToken);
    
    return { id: newTokenRef.key, ...newToken };
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

// Get tokens with real-time updates
export const getTokensRealtime = (callback: (tokens: Token[]) => void) => {
  // Query to get the 10 most recent tokens
  const tokensQuery = query(
    tokensRef,
    orderByChild('createdAt'),
    limitToLast(10)
  );
  
  // Set up listener
  const handleData = (snapshot: DataSnapshot) => {
    const tokens: Token[] = [];
    
    snapshot.forEach((childSnapshot) => {
      tokens.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse the array to get descending order (newest first)
    tokens.reverse();
    
    callback(tokens);
  };
  
  // Attach the listener
  onValue(tokensQuery, handleData);
  
  // Return a function to detach the listener
  return () => off(tokensQuery, 'value', handleData);
};

// Get tokens by creator address
export const getTokensByCreator = async (creatorAddress: string) => {
  try {
    const snapshot = await get(tokensRef);
    const tokens: Token[] = [];
    
    snapshot.forEach((childSnapshot) => {
      const token = childSnapshot.val();
      if (token.creatorAddress === creatorAddress) {
        tokens.push({
          id: childSnapshot.key,
          ...token
        });
      }
    });
    
    // Sort by creation date (newest first)
    return tokens.sort((a, b) => {
      const aTime = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt as Date).getTime();
      const bTime = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt as Date).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error getting tokens by creator:', error);
    throw error;
  }
};

// Get trending tokens
export const getTrendingTokens = async (limit = 5) => {
  try {
    // In a real app, this would use some algorithm to determine trending
    // For simplicity, we're just getting the most recent tokens
    const tokensQuery = query(
      tokensRef,
      orderByChild('createdAt'),
      limitToLast(limit)
    );
    
    const snapshot = await get(tokensQuery);
    const tokens: Token[] = [];
    
    snapshot.forEach((childSnapshot) => {
      tokens.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to get descending order (newest first)
    return tokens.reverse();
  } catch (error) {
    console.error('Error getting trending tokens:', error);
    throw error;
  }
};

// Get a single token by ID
export const getTokenById = async (id: string) => {
  try {
    const tokenRef = ref(db, `tokens/${id}`);
    const snapshot = await get(tokenRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() } as Token;
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Error getting token by ID:', error);
    throw error;
  }
};