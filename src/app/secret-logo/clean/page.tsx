'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import ProfessionalLogo from '@/components/ProfessionalLogo';
import '../styles.css';

const CleanLogoPage: FC = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy p-4">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div 
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Professional SVG Logo - Larger size for better screenshot quality */}
          <div className="mb-4">
            <ProfessionalLogo size={600} showText={false} />
          </div>
          
          {/* Logo Text - Enhanced Styling */}
          <div className="relative mb-2">
            <h1 className="text-6xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary drop-shadow-glow">
              <span className="font-extrabold">YUMS</span>
              <span className="text-white opacity-80 mx-1">.</span>
              <span className="font-extrabold">FUN</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
          
          {/* Small Back Link */}
          <div className="mt-16 opacity-30 hover:opacity-100 transition-opacity">
            <Link 
              href="/secret-logo" 
              className="text-primary text-xs transition-colors"
            >
              Back to Logo Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanLogoPage; 