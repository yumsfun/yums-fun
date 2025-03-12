'use client';

import { FC, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { createToken } from '@/firebase/tokenService';
import { createSolanaToken, getConnection, checkWalletBalance } from '@/services/solanaTokenService';
import { useRouter } from 'next/navigation';
import { Connection } from '@solana/web3.js';
import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';
import LoadingIndicator from '@/components/LoadingIndicator';

interface TokenFormValues {
  name: string;
  symbol: string;
  description: string;
  logoImage: File | null;
  logoPreview: string;
  initialSupply: number;
  taxFee: number;
}

const TokenCreationForm: FC = () => {
  const router = useRouter();
  const { publicKey, connected, wallet, signTransaction } = useWallet();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenId, setTokenId] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [txSignature, setTxSignature] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [solanaConnection, setSolanaConnection] = useState<Connection | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [hasEnoughSol, setHasEnoughSol] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
    
    // Initialize Solana connection
    const initConnection = async () => {
      try {
        const connection = await getConnection('devnet');
        setSolanaConnection(connection);
        
        // Check wallet balance if connected
        if (publicKey) {
          const { hasEnoughSol, balance } = await checkWalletBalance(connection, publicKey);
          setWalletBalance(balance);
          setHasEnoughSol(hasEnoughSol);
        }
      } catch (error) {
        console.error('Failed to initialize Solana connection:', error);
        setError('Failed to connect to Solana network. Please try again later.');
      }
    };
    
    initConnection();
  }, [publicKey]);
  
  const [formValues, setFormValues] = useState<TokenFormValues>({
    name: '',
    symbol: '',
    description: '',
    logoImage: null,
    logoPreview: '',
    initialSupply: 1000000,
    taxFee: 5,
  });
  
  const handleNextStep = () => {
    setIsVisible(false);
    setTimeout(() => {
      setStep(step + 1);
      setIsVisible(true);
    }, 300);
  };
  
  const handlePreviousStep = () => {
    setIsVisible(false);
    setTimeout(() => {
      setStep(step - 1);
      setIsVisible(true);
    }, 300);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormValues({
            ...formValues,
            logoImage: file,
            logoPreview: e.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  
  const calculateFee = () => {
    // Fee in SOL for token creation
    return 0.05;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || step !== 3 || !solanaConnection || !wallet) {
      setError('Wallet not connected or invalid state. Please try again.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check wallet balance first
      const { hasEnoughSol, balance } = await checkWalletBalance(solanaConnection, publicKey);
      setWalletBalance(balance);
      
      if (!hasEnoughSol) {
        setError(`Insufficient SOL balance. You need at least 0.05 SOL, but you have ${balance.toFixed(4)} SOL.`);
        setIsLoading(false);
        return;
      }
      
      console.log('Creating token on Solana blockchain...');
      
      // Create token on Solana blockchain
      const { signature, tokenAddress } = await createSolanaToken(
        wallet,
        solanaConnection,
        {
          name: formValues.name,
          symbol: formValues.symbol,
          decimals: 9, // Standard for Solana tokens
          initialSupply: formValues.initialSupply,
          taxFee: formValues.taxFee
        }
      );
      
      console.log('Token created on blockchain:', tokenAddress);
      console.log('Transaction signature:', signature);
      
      // Save signature and token address
      setTxSignature(signature);
      setTokenAddress(tokenAddress);
      
      // Generate a random market cap between 100k and 5M for display purposes
      const marketCap = Math.floor(Math.random() * 4900000) + 100000;
      
      // Random price change between -10% and +30% for display purposes
      const priceChange24h = (Math.random() * 40) - 10;
      
      // Prepare token data for Firebase
      const tokenData = {
        name: formValues.name,
        symbol: formValues.symbol,
        description: formValues.description || '',
        logo: formValues.logoPreview || '',
        marketCap,
        priceChange24h,
        creatorAddress: publicKey.toString(),
        contractAddress: tokenAddress,
        initialSupply: formValues.initialSupply,
        taxFee: formValues.taxFee,
        createdAt: new Date().toISOString(),
        transactionSignature: signature
      };
      
      // Save to Firebase
      const newToken = await createToken(tokenData);
      console.log('Token saved to Firebase:', newToken);
      
      // Save the token ID for navigation
      setTokenId(newToken.id || '');
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error creating token:', error);
      setIsLoading(false);
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          setError('Transaction was rejected by the wallet. Please try again.');
        } else if (error.message.includes('insufficient funds')) {
          setError('Insufficient SOL balance for this transaction.');
        } else if (error.message.includes('RPC')) {
          setError('Network connection issue. Please try again later.');
        } else {
          setError(`Failed to create token: ${error.message}`);
        }
      } else {
        setError('Failed to create token. Please try again.');
      }
    }
  };
  
  if (!connected) {
    return (
      <div className="glass rounded-xl p-8 max-w-2xl mx-auto text-center animate-fadeIn">
        <div className="w-20 h-20 bg-navy-400/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Connect Your Wallet</h2>
        <p className="text-gray-300 mb-6">Please connect your Solana wallet to create a new token.</p>
        <button className="btn-modern-primary mx-auto">Connect Wallet</button>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="glass rounded-xl p-8 max-w-2xl mx-auto text-center animate-fadeIn">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-navy">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Token Created Successfully!</h2>
        <p className="text-gray-300 mb-6">Your token "{formValues.name}" (${formValues.symbol}) has been created on the Solana blockchain.</p>
        
        <div className="mb-8 p-6 glass rounded-lg">
          <div className="flex items-center justify-center mb-4">
            {formValues.logoPreview ? (
              <div className="relative w-16 h-16 mr-3">
                <Image
                  src={formValues.logoPreview}
                  alt="Token logo"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 mr-3 rounded-full bg-primary flex items-center justify-center text-navy font-bold text-xl">
                {formValues.symbol.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex items-center mb-2 justify-center">
            <span className="font-medium text-gray-300 mr-2">Token Address:</span>
            <span className="text-primary">{tokenAddress}</span>
            <button 
              className="ml-2 text-gray-400 hover:text-primary transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(tokenAddress);
                alert('Address copied to clipboard!');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <span className="font-medium text-gray-300 mr-2">Transaction:</span>
            <span className="text-primary">{txSignature.substring(0, 8)}...{txSignature.substring(txSignature.length - 8)}</span>
            <button 
              className="ml-2 text-gray-400 hover:text-primary transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(txSignature);
                alert('Transaction signature copied to clipboard!');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-center">
            <a 
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View on Solana Explorer
            </a>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="btn-modern-primary"
            onClick={() => router.push(tokenId ? `/token/${tokenId}` : '/')}
          >
            View Token Page
          </button>
          <button
            className="btn-modern-outline"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-navy-700/80 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="glass p-8 rounded-xl max-w-md w-full text-center">
          <LoadingIndicator size="lg" message="Creating your token..." className="mb-4" />
          <p className="text-gray-300 mb-2">Please approve the transaction in your wallet when prompted.</p>
          <p className="text-xs text-gray-400">This may take up to a minute to complete.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-xl p-8 max-w-2xl mx-auto animate-fadeIn shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Your Token</h2>
      
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-navy-500 -translate-y-1/2 z-0"></div>
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                step > stepNumber 
                  ? 'bg-primary text-navy' 
                  : step === stepNumber
                    ? 'bg-primary text-navy animate-pulse'
                    : 'bg-navy-500 text-gray-400'
              }`}
            >
              {step > stepNumber ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            <span className={`text-sm ${step >= stepNumber ? 'text-white' : 'text-gray-400'}`}>
              {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Customize' : 'Confirm'}
            </span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 absolute -translate-y-10 pointer-events-none'} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Token Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white transition-all duration-300 hover:bg-navy-700/70"
                  placeholder="e.g. Yummy Token"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-1">
                  Token Symbol
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-navy-700/50 border border-r-0 border-navy-500 rounded-l-lg text-gray-300">
                    $
                  </span>
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    value={formValues.symbol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-navy-700/50 border border-navy-500 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary text-white uppercase transition-all duration-300 hover:bg-navy-700/70"
                    placeholder="e.g. YUM"
                    maxLength={5}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white transition-all duration-300 hover:bg-navy-700/70"
                  placeholder="Describe your token"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Token Logo
                </label>
                <div 
                  className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-navy-500 rounded-lg cursor-pointer hover:border-primary transition-colors bg-navy-700/30 hover:bg-navy-700/50"
                  onClick={triggerFileInput}
                >
                  {formValues.logoPreview ? (
                    <div className="relative w-32 h-32 hover:scale-105 transition-transform">
                      <Image
                        src={formValues.logoPreview}
                        alt="Token logo preview"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-gray-400 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm text-gray-400">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn-modern-primary hover-glow"
                  onClick={handleNextStep}
                >
                  Next Step
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Step 2: Token Parameters */}
        <div className={`transition-all duration-300 ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 absolute -translate-y-10 pointer-events-none'} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <label htmlFor="initialSupply" className="block text-sm font-medium text-gray-300 mb-1">
                  Initial Supply
                </label>
                <input
                  type="number"
                  id="initialSupply"
                  name="initialSupply"
                  value={formValues.initialSupply}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white transition-all duration-300 hover:bg-navy-700/70"
                  min="1000"
                  max="1000000000000"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">
                  The total number of tokens that will be minted initially
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="taxFee" className="block text-sm font-medium text-gray-300 mb-1">
                  Tax Fee (%)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    id="taxFee"
                    name="taxFee"
                    value={formValues.taxFee}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    min="0"
                    max="15"
                    step="0.5"
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-500 px-2 mt-1">
                    <span>0%</span>
                    <span>7.5%</span>
                    <span>15%</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-lg font-mono font-bold text-primary">{formValues.taxFee}%</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Percentage fee charged on each transaction (0-15%)
                </p>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="btn-modern-outline"
                  onClick={handlePreviousStep}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-modern-primary hover-glow"
                  onClick={handleNextStep}
                >
                  Review
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Step 3: Preview and Confirm */}
        <div className={`transition-all duration-300 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 absolute -translate-y-10 pointer-events-none'} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {step === 3 && (
            <div className="space-y-4">
              {/* Display wallet balance warning if insufficient */}
              {walletBalance !== null && !hasEnoughSol && (
                <ErrorMessage 
                  message={`Insufficient SOL Balance. You need at least 0.05 SOL to create a token. Your current balance is ${walletBalance.toFixed(4)} SOL.`}
                />
              )}
              
              {/* Display any errors */}
              <ErrorMessage message={error} />
              
              <div className="glass rounded-lg p-6 mb-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  {formValues.logoPreview ? (
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={formValues.logoPreview}
                        alt="Token logo"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mr-4 rounded-full bg-primary flex items-center justify-center text-navy font-bold text-xl">
                      {formValues.symbol.charAt(0)}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-bold text-xl text-white">{formValues.name}</h3>
                    <p className="text-sm text-gray-400">${formValues.symbol}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center py-2 border-b border-navy-500/50">
                    <span className="text-gray-400">Initial Supply:</span>
                    <span className="text-white font-mono">{formValues.initialSupply.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-navy-500/50">
                    <span className="text-gray-400">Tax Fee:</span>
                    <span className="text-white font-mono">{formValues.taxFee}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-navy-500/50">
                    <span className="text-gray-400">Creator:</span>
                    <span className="text-white font-mono">{publicKey?.toString().substring(0, 4)}...{publicKey?.toString().substring(publicKey.toString().length - 4)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white font-mono">Solana (Devnet)</span>
                  </div>
                  {walletBalance !== null && (
                    <div className="flex justify-between items-center py-2 border-t border-navy-500/50">
                      <span className="text-gray-400">Your Balance:</span>
                      <span className={`font-mono ${hasEnoughSol ? 'text-green-400' : 'text-red-400'}`}>
                        {walletBalance.toFixed(4)} SOL
                      </span>
                    </div>
                  )}
                </div>
                
                {formValues.description && (
                  <div className="border-t border-navy-500/50 pt-3 mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Description:</h4>
                    <p className="text-sm text-gray-300">{formValues.description}</p>
                  </div>
                )}
              </div>
              
              <div className="glass rounded-lg p-6 mb-6 hover:shadow-lg transition-all duration-300">
                <h3 className="font-medium text-white mb-4">Launch Fee</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Create and deploy token</span>
                  <span className="text-primary font-mono font-medium text-lg">{calculateFee()} SOL</span>
                </div>
                <div className="mt-4 pt-4 border-t border-navy-500/50 text-xs text-gray-400">
                  By creating this token, you agree to our terms of service and understand that you are responsible for any actions taken with this token.
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="btn-modern-outline"
                  onClick={handlePreviousStep}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-modern-primary hover-glow"
                  disabled={isLoading || !hasEnoughSol}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingIndicator size="sm" message={undefined} />
                      <span className="ml-2">Creating Token...</span>
                    </div>
                  ) : (
                    <>
                      Create Token
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TokenCreationForm; 