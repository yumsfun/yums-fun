'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);
  
  return (
    <section className="pt-24 pb-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-accent-purple/5 blur-3xl"></div>
        <div className="absolute top-40 right-1/3 w-6 h-6 rounded-full bg-primary animate-float"></div>
        <div className="absolute top-60 left-1/3 w-4 h-4 rounded-full bg-accent-teal/50 animate-float delay-300"></div>
        <div className="absolute bottom-20 right-1/4 w-5 h-5 rounded-full bg-accent-red/50 animate-float delay-200"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Heading */}
        <h1 
          className={`text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Launch your Solana token in seconds
        </h1>
        
        {/* Subheading */}
        <p 
          className={`text-lg text-foreground-secondary mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          The easiest way to create, launch and trade memecoins on Solana with no code required
        </p>
        
        {/* Main CTA */}
        <div 
          className={`mb-12 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Link 
            href="/create" 
            className="btn-modern-primary text-lg py-3 px-8 hover-glow"
          >
            <span className="relative z-10">Create a Token</span>
          </Link>
          
          <Link
            href="/explore"
            className="btn-modern-outline ml-4 text-lg py-3 px-8"
          >
            Explore Tokens
          </Link>
        </div>
        
        {/* Stats */}
        <div 
          className={`flex flex-wrap justify-center gap-8 mb-16 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">42</div>
            <div className="text-sm text-foreground-secondary">Tokens Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">$2.2K</div>
            <div className="text-sm text-foreground-secondary">Trading Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">{Math.floor(Math.random() * 900) + 100}</div>
            <div className="text-sm text-foreground-secondary">Active Users</div>
          </div>
        </div>
        
        {/* Trending Section Title */}
        <div 
          className={`transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block relative">
            <h2 className="text-xl font-medium text-white mb-4 relative z-10">now trending</h2>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -skew-x-12 z-0"></div>
          </div>
        </div>
      </div>
      
      {/* Subtle background effect */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-1/3 h-12 bg-primary/5 blur-3xl rounded-full z-0"></div>
    </section>
  );
};

export default HeroSection; 