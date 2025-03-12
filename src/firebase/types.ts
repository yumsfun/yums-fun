import { Timestamp } from 'firebase/firestore';

// Unified Token interface for both Realtime Database and Firestore
export interface Token {
  id?: string;
  name: string;
  symbol: string;
  logo: string;
  description?: string;
  marketCap: number;
  priceChange24h: number;
  createdAt: number | Date | Timestamp; // Support all timestamp formats
  creatorAddress: string;
  replies: number;
  contractAddress?: string;
  initialSupply?: number;
  taxFee?: number;
  transactionSignature?: string; // Solana transaction signature
} 