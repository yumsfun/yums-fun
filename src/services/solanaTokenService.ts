import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  sendAndConfirmTransaction,
  Keypair
} from '@solana/web3.js';
import { 
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  getMint,
  createMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction
} from '@solana/spl-token';

// RPC endpoints for different networks
const ENDPOINTS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  // Add fallback RPC endpoints
  fallbacks: {
    mainnet: [
      'https://solana-mainnet.g.alchemy.com/v2/your-api-key', // Replace with your API key if using Alchemy
      'https://mainnet.helius-rpc.com/?api-key=your-api-key', // Replace with your API key if using Helius
    ],
    devnet: [
      'https://api.devnet.solana.com',
      'https://devnet.helius-rpc.com/?api-key=your-api-key', // Replace with your API key if using Helius
    ]
  }
};

// Default to devnet for safety
const DEFAULT_NETWORK = 'devnet';

/**
 * Creates a new token on the Solana blockchain
 */
export const createSolanaToken = async (
  wallet: any, // Wallet adapter
  connection: Connection,
  tokenData: {
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: number;
    taxFee?: number;
  }
): Promise<{ signature: string; tokenAddress: string }> => {
  try {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    console.log('Creating token with data:', tokenData);
    console.log('Using wallet:', wallet.publicKey.toString());

    // Create a new mint account
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey;
    
    console.log('Generated mint address:', mintAddress.toString());

    // Calculate the rent for the mint
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    
    console.log('Required lamports for rent:', lamports);

    // Create a transaction to create the mint account
    const transaction = new Transaction();
    
    // Add instruction to create account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintAddress,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    
    // Add instruction to initialize the mint
    transaction.add(
      createInitializeMintInstruction(
        mintAddress,
        tokenData.decimals,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID
      )
    );
    
    // Get the associated token account for the wallet
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      wallet.publicKey
    );
    
    console.log('Associated token account:', associatedTokenAccount.toString());
    
    // Add instruction to create the associated token account if it doesn't exist
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAccount,
        wallet.publicKey,
        mintAddress
      )
    );
    
    // Add instruction to mint tokens to the wallet
    const mintAmount = tokenData.initialSupply * Math.pow(10, tokenData.decimals);
    transaction.add(
      createMintToInstruction(
        mintAddress,
        associatedTokenAccount,
        wallet.publicKey,
        BigInt(mintAmount)
      )
    );
    
    // Set recent blockhash and fee payer
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = wallet.publicKey;
    
    console.log('Transaction prepared, requesting signature...');
    
    // Sign the transaction with the wallet and mint keypair
    const signedTransaction = await wallet.signTransaction(transaction);
    signedTransaction.partialSign(mintKeypair);
    
    console.log('Transaction signed, sending to network...');
    
    // Send the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    console.log('Transaction sent, waiting for confirmation...');
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
    console.log('Transaction confirmed!');
    
    return {
      signature,
      tokenAddress: mintAddress.toString()
    };
  } catch (error) {
    console.error('Error creating Solana token:', error);
    throw error;
  }
};

/**
 * Get a connection with fallback support
 */
export const getConnection = async (network: 'mainnet' | 'devnet' = DEFAULT_NETWORK): Promise<Connection> => {
  const primaryEndpoint = ENDPOINTS[network];
  const fallbackEndpoints = ENDPOINTS.fallbacks[network];
  
  // Try primary endpoint first
  try {
    const connection = new Connection(primaryEndpoint, 'confirmed');
    await connection.getLatestBlockhash(); // Test the connection
    return connection;
  } catch (error) {
    console.warn(`Primary RPC endpoint failed, trying fallbacks...`);
    
    // Try fallbacks
    for (const endpoint of fallbackEndpoints) {
      try {
        const connection = new Connection(endpoint, 'confirmed');
        await connection.getLatestBlockhash(); // Test the connection
        console.log(`Connected to fallback RPC: ${endpoint}`);
        return connection;
      } catch (fallbackError) {
        console.warn(`Fallback RPC endpoint failed: ${endpoint}`);
      }
    }
    
    // If all fallbacks fail, throw error
    throw new Error('All RPC endpoints failed. Please try again later.');
  }
};

/**
 * Check if the wallet has sufficient SOL balance
 */
export const checkWalletBalance = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<{ hasEnoughSol: boolean; balance: number }> => {
  try {
    const balance = await connection.getBalance(publicKey);
    const balanceInSol = balance / 1_000_000_000; // Convert lamports to SOL
    
    // Minimum required is 0.05 SOL (this is an estimate, adjust as needed)
    const minimumRequired = 0.05;
    
    return {
      hasEnoughSol: balanceInSol >= minimumRequired,
      balance: balanceInSol
    };
  } catch (error) {
    console.error('Error checking wallet balance:', error);
    throw error;
  }
}; 