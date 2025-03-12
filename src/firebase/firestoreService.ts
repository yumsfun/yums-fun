import { firestore } from './config';
import { 
  collection, 
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { Token } from './types';

// Collection reference
const tokensCollection = collection(firestore, 'tokens');

// Create a new token with Firestore
export const createTokenWithFirestore = async (tokenData: Omit<Token, 'id' | 'createdAt' | 'replies'>) => {
  try {
    // Create token data with timestamp
    const newToken = { 
      ...tokenData, 
      createdAt: Timestamp.now(),
      replies: 0
    };
    
    // Add document to collection
    const docRef = await addDoc(tokensCollection, newToken);
    
    return { 
      id: docRef.id, 
      ...newToken,
      createdAt: newToken.createdAt.toMillis() // Convert Timestamp to milliseconds for consistent return type
    };
  } catch (error) {
    console.error('Error creating token in Firestore:', error);
    throw error;
  }
};

// Get tokens with real-time updates from Firestore
export const getTokensRealtimeWithFirestore = (callback: (tokens: Token[]) => void) => {
  // Query to get the 10 most recent tokens
  const tokensQuery = query(
    tokensCollection,
    orderBy('createdAt', 'desc'),
    firestoreLimit(10)
  );
  
  // Set up listener
  const unsubscribe = onSnapshot(tokensQuery, (querySnapshot) => {
    const tokens: Token[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tokens.push({
        id: doc.id,
        ...data,
        // Convert Firebase timestamp to milliseconds for consistency
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt
      } as Token);
    });
    
    callback(tokens);
  });
  
  // Return the unsubscribe function
  return unsubscribe;
};

// Get tokens by creator address from Firestore
export const getTokensByCreatorWithFirestore = async (creatorAddress: string) => {
  try {
    const tokensQuery = query(
      tokensCollection,
      where('creatorAddress', '==', creatorAddress),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(tokensQuery);
    const tokens: Token[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tokens.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt
      } as Token);
    });
    
    return tokens;
  } catch (error) {
    console.error('Error getting tokens by creator from Firestore:', error);
    throw error;
  }
};

// Get trending tokens from Firestore
export const getTrendingTokensWithFirestore = async (limitCount = 5) => {
  try {
    // In a real app, this would use some algorithm to determine trending
    // For simplicity, we're just getting the most recent tokens
    const tokensQuery = query(
      tokensCollection,
      orderBy('createdAt', 'desc'),
      firestoreLimit(limitCount)
    );
    
    const querySnapshot = await getDocs(tokensQuery);
    const tokens: Token[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tokens.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt
      } as Token);
    });
    
    return tokens;
  } catch (error) {
    console.error('Error getting trending tokens from Firestore:', error);
    throw error;
  }
};

// Get a single token by ID from Firestore
export const getTokenByIdWithFirestore = async (id: string) => {
  try {
    const docRef = doc(firestore, 'tokens', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt
      } as Token;
    } else {
      throw new Error('Token not found in Firestore');
    }
  } catch (error) {
    console.error('Error getting token by ID from Firestore:', error);
    throw error;
  }
}; 