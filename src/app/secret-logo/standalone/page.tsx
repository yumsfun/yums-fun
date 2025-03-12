'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import ProfessionalLogo from '@/components/ProfessionalLogo';
import '../styles.css';

const StandaloneLogoPage: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4">
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

export default StandaloneLogoPage; 