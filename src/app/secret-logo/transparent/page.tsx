'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import ProfessionalLogo from '@/components/ProfessionalLogo';
import '../styles.css';

const TransparentLogoPage: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
    
    // Set body background to transparent/checkered pattern
    document.body.classList.add('transparent-bg');
    
    return () => {
      document.body.classList.remove('transparent-bg');
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transparent-bg">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div 
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Professional SVG Logo - Larger size for better screenshot quality */}
          <div className="mb-4">
            <ProfessionalLogo size={500} showText={false} />
          </div>
          
          {/* Logo Text - Enhanced Styling */}
          <div className="relative mb-2">
            <h1 className="text-5xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary drop-shadow-glow">
              <span className="font-extrabold">YUMS</span>
              <span className="text-white opacity-80 mx-1">.</span>
              <span className="font-extrabold">FUN</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 p-4 bg-navy-400/80 backdrop-blur-sm rounded-lg inline-block">
            <p className="text-white text-sm">
              This transparent version is perfect for branding materials
            </p>
          </div>
          
          {/* Back Link */}
          <div className="mt-8">
            <Link 
              href="/secret-logo" 
              className="text-primary hover:text-primary-300 transition-colors flex items-center justify-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                ←
              </span>
              <span>Back to Logo Page</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparentLogoPage; 