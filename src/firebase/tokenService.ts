import { ref, push, set, get, child, update, remove, onValue, off, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from './config';
import { Token } from './types';
import { Timestamp } from 'firebase/firestore';

const TOKENS_REF = 'tokens';

/**
 * Create a new token
 */
export const createToken = async (tokenData: Omit<Token, 'id'>): Promise<Token> => {
  try {
    // Generate a reference with auto-generated ID
    const newTokenRef = push(ref(db, TOKENS_REF));
    
    // Set default values if not provided
    const token: Omit<Token, 'id'> = {
      ...tokenData,
      createdAt: tokenData.createdAt || new Date(),
      replies: tokenData.replies || 0,
      initialSupply: tokenData.initialSupply || 1000000,
      taxFee: tokenData.taxFee || 0,
    };
    
    // Save token data
    await set(newTokenRef, token);
    
    // Return the token with its ID
    return {
      id: newTokenRef.key || '',
      ...token
    };
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error(`Failed to create token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a token by ID
 */
export const getToken = async (tokenId: string): Promise<Token | null> => {
  try {
    const snapshot = await get(child(ref(db), `${TOKENS_REF}/${tokenId}`));
    
    if (snapshot.exists()) {
      return {
        id: tokenId,
        ...snapshot.val()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    throw new Error(`Failed to get token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Add alias for getToken as getTokenById for backward compatibility
export const getTokenById = getToken;

/**
 * Get all tokens
 */
export const getTokens = async (): Promise<Token[]> => {
  try {
    const snapshot = await get(ref(db, TOKENS_REF));
    
    if (snapshot.exists()) {
      const tokens: Token[] = [];
      
      snapshot.forEach((childSnapshot) => {
        tokens.push({
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        });
      });
      
      return tokens;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw new Error(`Failed to get tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update a token
 */
export const updateToken = async (tokenId: string, tokenData: Partial<Token>): Promise<void> => {
  try {
    const updates: Record<string, any> = {};
    updates[`${TOKENS_REF}/${tokenId}`] = tokenData;
    
    await update(ref(db), updates);
  } catch (error) {
    console.error('Error updating token:', error);
    throw new Error(`Failed to update token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a token
 */
export const deleteToken = async (tokenId: string): Promise<void> => {
  try {
    await remove(ref(db, `${TOKENS_REF}/${tokenId}`));
  } catch (error) {
    console.error('Error deleting token:', error);
    throw new Error(`Failed to delete token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Subscribe to tokens in real-time
 */
export const getTokensRealtime = (callback: (tokens: Token[]) => void): (() => void) => {
  const tokensRef = query(
    ref(db, TOKENS_REF),
    orderByChild('createdAt'),
    limitToLast(50)
  );
  
  onValue(tokensRef, (snapshot) => {
    const tokens: Token[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        tokens.push({
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        });
      });
      
      // Sort by createdAt in descending order (newest first)
      tokens.sort((a, b) => {
        const dateA = getTimestampValue(a.createdAt);
        const dateB = getTimestampValue(b.createdAt);
        return dateB - dateA;
      });
    }
    
    callback(tokens);
  });
  
  // Return unsubscribe function
  return () => off(tokensRef);
};

// Helper function to safely get timestamp value
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

// Get tokens by creator address
export const getTokensByCreator = async (creatorAddress: string) => {
  try {
    const snapshot = await get(ref(db, TOKENS_REF));
    const tokens: Token[] = [];
    
    snapshot.forEach((childSnapshot) => {
      const token = childSnapshot.val();
      if (token.creatorAddress === creatorAddress) {
        tokens.push({
          id: childSnapshot.key || '',
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
      ref(db, TOKENS_REF),
      orderByChild('createdAt'),
      limitToLast(limit)
    );
    
    const snapshot = await get(tokensQuery);
    const tokens: Token[] = [];
    
    snapshot.forEach((childSnapshot) => {
      tokens.push({
        id: childSnapshot.key || '',
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