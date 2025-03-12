'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import ProfessionalLogo from '@/components/ProfessionalLogo';
import './styles.css';

const TwitterHeaderPage: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
    
    // Set body background to dark
    document.body.style.backgroundColor = '#12131A';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);
  
  return (
    <div className="relative w-full overflow-hidden">
      {/* Twitter Header Container - 1500x500 pixels */}
      <div 
        className="relative mx-auto bg-navy twitter-header-container"
        style={{ 
          width: '1500px', 
          height: '500px',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-purple/5 blur-3xl"></div>
          <div className="absolute top-40 right-1/3 w-8 h-8 rounded-full bg-primary animate-float"></div>
          <div className="absolute top-60 left-1/3 w-6 h-6 rounded-full bg-teal/50 animate-float delay-300"></div>
          <div className="absolute bottom-20 right-1/4 w-7 h-7 rounded-full bg-red/50 animate-float delay-200"></div>
        </div>
        
        {/* Content Container */}
        <div 
          className={`absolute inset-0 flex items-center justify-between px-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <ProfessionalLogo size={200} showText={false} />
          </div>
          
          {/* Center - Text */}
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary drop-shadow-glow">
              <span className="font-extrabold">YUMS</span>
              <span className="text-white opacity-80 mx-1">.</span>
              <span className="font-extrabold">FUN</span>
            </h1>
            <p className="text-xl text-foreground-secondary mt-4">
              Launch your Solana token in seconds
            </p>
            <p className="text-lg text-primary-light mt-2">
              @yumsdotfun
            </p>
          </div>
          
          {/* Right Side - Stats */}
          <div className="flex flex-col gap-4">
            <div className="text-center bg-navy-800/50 backdrop-blur-sm px-8 py-3 rounded-xl border border-primary/20">
              <div className="text-3xl font-mono font-bold text-primary">42</div>
              <div className="text-sm text-foreground-secondary">Tokens Created</div>
            </div>
            <div className="text-center bg-navy-800/50 backdrop-blur-sm px-8 py-3 rounded-xl border border-primary/20">
              <div className="text-3xl font-mono font-bold text-primary">$2.2K</div>
              <div className="text-sm text-foreground-secondary">Trading Volume</div>
            </div>
          </div>
        </div>
        
        {/* Currency Symbols Floating */}
        <div className="absolute top-20 left-40 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-navy font-bold animate-float">$</div>
        <div className="absolute bottom-20 right-40 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-navy font-bold animate-float delay-300">¥</div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-navy font-bold animate-float delay-150">€</div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-navy font-bold animate-float delay-450">£</div>
      </div>
      
      {/* Instructions */}
      <div className="mt-8 text-center max-w-xl mx-auto">
        <p className="text-foreground-secondary mb-4">
          Take a screenshot of the header above for your Twitter profile (1500x500 pixels)
        </p>
        <Link 
          href="/" 
          className="text-primary hover:text-primary-light transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TwitterHeaderPage; 