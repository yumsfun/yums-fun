'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface ProfessionalLogoProps {
  size?: number;
  showText?: boolean;
  onClick?: () => void;
}

const ProfessionalLogo: React.FC<ProfessionalLogoProps> = ({ 
  size = 300, 
  showText = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);
  
  const handleClick = () => {
    setIsClicked(true);
    if (onClick) onClick();
  };
  
  // Colors from the theme
  const primaryColor = "#FFD100";
  const primaryLight = "#FFE666";
  const primaryDark = "#E6BC00";
  const navyColor = "#12131A";
  const navyLight = "#2A2D3A";
  
  // Calculate dimensions based on size
  const viewBoxSize = 240;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const mainRadius = viewBoxSize * 0.4;
  
  // Animation variants
  const coinVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    click: { 
      scale: [1, 1.2, 1.1],
      rotate: [0, 10, 0],
      transition: { duration: 0.5 }
    }
  };
  
  const glowVariants: Variants = {
    initial: { opacity: 0.5, scale: 1 },
    hover: { opacity: 0.8, scale: 1.1, transition: { duration: 0.3 } },
    click: { opacity: 0.9, scale: 1.2, transition: { duration: 0.5 } }
  };
  
  const orbitVariants: Variants = {
    initial: { opacity: 0.3, rotate: 0 },
    animate: { 
      opacity: isHovered ? 0.5 : 0.3, 
      rotate: 360,
      transition: { 
        rotate: { 
          duration: isClicked ? 10 : 20, 
          ease: "linear", 
          repeat: Infinity 
        },
        opacity: { duration: 0.3 }
      }
    }
  };
  
  const letterVariants: Variants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 3, transition: { duration: 0.3 } },
    click: { 
      scale: [1, 1.25, 1.1],
      rotate: [0, 12, 3],
      transition: { duration: 0.5 }
    }
  };
  
  const textVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    click: { 
      scale: [1, 1.1, 1.05],
      transition: { duration: 0.5 }
    }
  };
  
  // Coin burst animations
  const burstVariants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      x: getBurstX(i),
      y: getBurstY(i),
      transition: { 
        duration: 0.8,
      }
    })
  };
  
  // Helper functions for burst animations
  const getBurstX = (i: number): number[] => {
    switch(i) {
      case 0: return [0, -30];
      case 1: return [0, 30];
      case 2: return [0, -30];
      case 3: return [0, 30];
      case 4: return [0, -40];
      case 5: return [0, 40];
      default: return [0, 0];
    }
  };
  
  const getBurstY = (i: number): number[] => {
    switch(i) {
      case 0: return [0, -30];
      case 1: return [0, -30];
      case 2: return [0, 30];
      case 3: return [0, 30];
      case 4: return [0, 0];
      case 5: return [0, 0];
      default: return [0, 0];
    }
  };
  
  // Small currency symbols positions
  const currencyPositions = [
    { x: centerX, y: centerY - mainRadius * 0.85, symbol: '$' },
    { x: centerX, y: centerY + mainRadius * 0.85, symbol: '¥' },
    { x: centerX - mainRadius * 0.85, y: centerY, symbol: '€' },
    { x: centerX + mainRadius * 0.85, y: centerY, symbol: '£' },
  ];
  
  // Sparkle positions
  const sparklePositions = [
    { x: centerX + 20, y: centerY - 25, delay: 0, size: 3 },
    { x: centerX - 15, y: centerY - 20, delay: 0.5, size: 2 },
    { x: centerX + 10, y: centerY + 25, delay: 1, size: 2 },
  ];
  
  // Floating elements
  const floatingElements = [
    { x: centerX + mainRadius * 0.7, y: centerY - mainRadius * 0.5, size: 4, delay: 0.7, color: primaryLight },
    { x: centerX - mainRadius * 0.7, y: centerY + mainRadius * 0.5, size: 3, delay: 1.2, color: primaryDark },
  ];
  
  // Burst positions
  const burstPositions = [
    { x: centerX - 20, y: centerY - 20 },
    { x: centerX + 20, y: centerY - 20 },
    { x: centerX - 20, y: centerY + 20 },
    { x: centerX + 20, y: centerY + 20 },
    { x: centerX - 25, y: centerY },
    { x: centerX + 25, y: centerY },
  ];
  
  // Custom Y path for more stylish look - completely redesigned with a unique shape
  const yPath = `
    M${centerX - 20},${centerY - 35}
    Q${centerX - 10},${centerY - 35} ${centerX - 5},${centerY - 25}
    L${centerX},${centerY - 15}
    L${centerX + 5},${centerY - 25}
    Q${centerX + 10},${centerY - 35} ${centerX + 20},${centerY - 35}
    Q${centerX + 30},${centerY - 30} ${centerX + 15},${centerY - 10}
    Q${centerX + 10},${centerY - 5} ${centerX + 8},${centerY}
    Q${centerX + 8},${centerY + 10} ${centerX + 8},${centerY + 15}
    Q${centerX + 8},${centerY + 20} ${centerX},${centerY + 25}
    Q${centerX - 8},${centerY + 20} ${centerX - 8},${centerY + 15}
    Q${centerX - 8},${centerY + 10} ${centerX - 8},${centerY}
    Q${centerX - 10},${centerY - 5} ${centerX - 15},${centerY - 10}
    Q${centerX - 30},${centerY - 30} ${centerX - 20},${centerY - 35}
    Z
  `;
  
  // Highlight path for the new Y design
  const highlightPath = `
    M${centerX - 15},${centerY - 30}
    Q${centerX - 10},${centerY - 28} ${centerX - 8},${centerY - 22}
    L${centerX - 5},${centerY - 18}
    Z
  `;
  
  // Subtle accent details
  const accentPath = `
    M${centerX - 5},${centerY + 15}
    Q${centerX},${centerY + 18} ${centerX + 5},${centerY + 15}
  `;
  
  return (
    <div 
      style={{ width: size, height: size }}
      className="relative mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
        className="cursor-pointer"
      >
        {/* Definitions */}
        <defs>
          {/* Main Coin Gradient */}
          <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryLight} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryDark} />
          </linearGradient>
          
          {/* Inner Circle Gradient */}
          <radialGradient id="innerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={navyLight} />
            <stop offset="100%" stopColor={navyColor} />
          </radialGradient>
          
          {/* Glow Effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Grid Pattern */}
          <pattern id="gridPattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="20" stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.1" />
            <line x1="0" y1="0" x2="20" y2="0" stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.1" />
          </pattern>
          
          {/* Shine Effect */}
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate attributeName="x1" from="-100%" to="100%" dur="2s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="200%" dur="2s" repeatCount="indefinite" />
          </linearGradient>
          
          {/* Y Letter Gradient */}
          <linearGradient id="yGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryLight} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryDark} />
          </linearGradient>
          
          {/* Y Letter Vertical Gradient */}
          <linearGradient id="yVerticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primaryLight} />
            <stop offset="100%" stopColor={primaryDark} />
          </linearGradient>
          
          {/* 3D Effect for Y */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color={navyColor} flood-opacity="0.5" />
          </filter>
          
          {/* Metallic Effect */}
          <linearGradient id="metallicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryDark} />
            <stop offset="30%" stopColor={primaryLight} />
            <stop offset="70%" stopColor={primaryLight} />
            <stop offset="100%" stopColor={primaryDark} />
          </linearGradient>
        </defs>
        
        {/* Glow Background */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={mainRadius + 5}
          fill={primaryColor}
          opacity={0.2}
          filter="url(#glow)"
          variants={glowVariants}
          initial="initial"
          animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
        />
        
        {/* Main Coin Circle */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={mainRadius}
          fill="url(#coinGradient)"
          variants={coinVariants}
          initial="initial"
          animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
        />
        
        {/* Inner Circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={mainRadius - 8}
          fill="url(#innerGradient)"
        />
        
        {/* Grid Pattern Background */}
        <circle
          cx={centerX}
          cy={centerY}
          r={mainRadius - 8}
          fill="url(#gridPattern)"
          opacity={0.1}
        />
        
        {/* Shine Effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={mainRadius - 8}
          fill="url(#shineGradient)"
          opacity={0.2}
        >
        </circle>
        
        {/* Orbit Ring */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={mainRadius}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          strokeDasharray="6 4"
          variants={orbitVariants}
          initial="initial"
          animate="animate"
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        />
        
        {/* Y Letter - Custom Path */}
        <motion.g
          variants={letterVariants}
          initial="initial"
          animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        >
          {/* Shadow/3D effect base */}
          <path
            d={yPath}
            fill={primaryDark}
            transform="translate(3, 3)"
            opacity="0.3"
          />
          
          {/* Main Y shape */}
          <path
            d={yPath}
            fill="url(#yVerticalGradient)"
            filter="url(#shadow)"
          />
          
          {/* Metallic edge effect */}
          <path
            d={yPath}
            fill="none"
            stroke="url(#metallicGradient)"
            strokeWidth="1.5"
            opacity="0.7"
          />
          
          {/* Highlight */}
          <path
            d={highlightPath}
            fill="white"
            opacity="0.2"
          />
          
          {/* Additional details - subtle accent line */}
          <path
            d={accentPath}
            fill="none"
            stroke={primaryLight}
            strokeWidth="1.5"
            opacity="0.6"
          />
          
          {/* Subtle dot accents */}
          <circle
            cx={centerX + 18}
            cy={centerY - 25}
            r={1.5}
            fill="white"
            opacity="0.7"
          />
          
          <circle
            cx={centerX - 18}
            cy={centerY - 25}
            r={1.5}
            fill="white"
            opacity="0.7"
          />
          
          {/* Bottom accent */}
          <path
            d={`M${centerX - 8},${centerY + 22} L${centerX + 0},${centerY + 22}`}
            stroke={primaryLight}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </motion.g>
        
        {/* Currency Symbols */}
        {currencyPositions.map((pos, index) => (
          <motion.g key={index}
            variants={coinVariants}
            initial="initial"
            animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={12}
              fill="url(#coinGradient)"
            />
            <text
              x={pos.x}
              y={pos.y}
              fontSize="14"
              fontWeight="bold"
              fill={navyColor}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {pos.symbol}
            </text>
          </motion.g>
        ))}
        
        {/* Sparkle Effects */}
        {sparklePositions.map((sparkle, index) => (
          <circle
            key={`sparkle-${index}`}
            cx={sparkle.x}
            cy={sparkle.y}
            r={sparkle.size}
            fill="#FFFFFF"
            opacity={0.8}
          >
            <animate
              attributeName="opacity"
              values="0.8;0.2;0.8"
              dur="1.5s"
              begin={`${sparkle.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        
        {/* Floating Elements */}
        {floatingElements.map((element, index) => (
          <circle
            key={`float-${index}`}
            cx={element.x}
            cy={element.y}
            r={element.size}
            fill={element.color}
          >
            <animate
              attributeName="cy"
              values={`${element.y};${element.y - 10};${element.y};${element.y + 10};${element.y}`}
              dur="6s"
              begin={`${element.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values={`${element.x};${element.x + 5};${element.x + 10};${element.x + 5};${element.x}`}
              dur="6s"
              begin={`${element.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        
        {/* Coin Burst Effect */}
        <AnimatePresence>
          {isClicked && burstPositions.map((pos, i) => (
            <motion.circle
              key={`burst-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={3}
              fill={primaryColor}
              custom={i}
              variants={burstVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>
      </svg>
      
      {/* Logo Text */}
      {showText && (
        <motion.div
          className="text-center mt-4"
          variants={textVariants}
          initial="initial"
          animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
        >
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary drop-shadow-glow">
              <span className="font-extrabold">YUMS</span>
              <span className="text-white opacity-80 mx-1">.</span>
              <span className="font-extrabold">FUN</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfessionalLogo; 