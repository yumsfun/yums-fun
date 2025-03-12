'use client';

// Updated roadmap page - triggering new deployment
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

// Roadmap data with 3 months of milestones
const ROADMAP_DATA = [
  {
    title: "Community & Stability",
    items: [
      "Launch improved trending algorithm",
      "Enhance creator verification system",
      "Improve mobile responsiveness",
      "Add multi-language support",
      "Implement community voting on trending items"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
      </svg>
    ),
    color: "text-blue-500"
  },
  {
    title: "Trading Enhancements",
    items: [
      "Launch advanced trading features",
      "Add price charts & technical indicators",
      "Implement batch trades & automated tools",
      "Integrate additional payment methods",
      "Launch mobile trading application"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
      </svg>
    ),
    color: "text-purple-500"
  },
  {
    title: "Creator Empowerment",
    items: [
      "Launch creator dashboard analytics",
      "Add customizable creator storefronts",
      "Implement content monetization tools",
      "Launch digital asset management platform",
      "Enable cross-platform content integration"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    ),
    color: "text-rose-500"
  }
];

export default function RoadmapPage() {
  const [isVisible, setIsVisible] = useState(Array(ROADMAP_DATA.length).fill(false));
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate sections into view as user scrolls
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (target.dataset && target.dataset.index) {
            const index = Number(target.dataset.index);
            if (entry.isIntersecting) {
              setIsVisible((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-500 to-navy-600 text-white">
      <Header />
      
      {/* Hero section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-6">
            yums.fun Roadmap
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Our journey to build the most delicious platform for creators and collectors.
            Explore our upcoming features and milestones.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary">
            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-primary"></span>
            Currently in active development
          </div>
        </motion.div>
      </section>
      
      {/* Timeline navigation */}
      <div className="sticky top-16 z-10 bg-navy-500/80 backdrop-blur-md py-4 border-y border-navy-400/20">
        <div className="max-w-5xl mx-auto px-4 flex justify-between">
          {ROADMAP_DATA.map((phase, index) => (
            <button
              key={index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                activeIndex === index
                  ? 'bg-navy-300/20 text-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => {
                if (sectionRefs.current[index]) {
                  window.scrollTo({
                    top: sectionRefs.current[index]?.offsetTop ? sectionRefs.current[index]!.offsetTop - 100 : 0,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <span className={`${phase.color}`}>{phase.icon}</span>
              <span className="hidden sm:inline">{phase.title}</span>
              <span className="inline sm:hidden">Phase {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Roadmap sections */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {ROADMAP_DATA.map((phase, index) => (
          <motion.section
            key={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            data-index={index.toString()}
            variants={containerVariants}
            initial="hidden"
            animate={isVisible[index] ? "visible" : "hidden"}
            className="mb-20 relative"
          >
            {/* Timeline connector */}
            {index < ROADMAP_DATA.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-gray-500/50 to-transparent h-full" />
            )}
            
            <motion.div variants={sectionVariants} className="flex">
              <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full ${index === 0 ? 'bg-blue-500/20' : index === 1 ? 'bg-purple-500/20' : 'bg-rose-500/20'} flex items-center justify-center`}>
                <div className={`w-12 h-12 rounded-full ${index === 0 ? 'bg-blue-500/30' : index === 1 ? 'bg-purple-500/30' : 'bg-rose-500/30'} flex items-center justify-center`}>
                  <span className={phase.color}>{phase.icon}</span>
                </div>
              </div>
              
              <div className="ml-6 flex-1">
                <motion.h2 
                  variants={itemVariants}
                  className={`text-2xl font-bold mb-3 flex items-center ${index === 0 ? 'text-blue-400' : index === 1 ? 'text-purple-400' : 'text-rose-400'}`}
                >
                  {phase.title}
                  <span className="ml-3 text-sm font-normal text-gray-400 bg-navy-400/30 px-2 py-1 rounded-full">
                    Phase {index + 1}
                  </span>
                </motion.h2>
                
                <motion.div 
                  variants={itemVariants}
                  className={`mb-6 p-5 rounded-xl bg-navy-400/20 border ${
                    index === 0 
                      ? 'border-blue-500/20' 
                      : index === 1 
                      ? 'border-purple-500/20' 
                      : 'border-rose-500/20'
                  }`}
                >
                  <ul className="space-y-3">
                    {phase.items.map((item, itemIndex) => (
                      <motion.li 
                        key={itemIndex}
                        variants={itemVariants}
                        className="flex items-start"
                      >
                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                          index === 0 
                            ? 'bg-blue-500' 
                            : index === 1 
                            ? 'bg-purple-500' 
                            : 'bg-rose-500'
                        }`} />
                        <span className="ml-3 text-gray-300">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </motion.section>
        ))}
      </div>
      
      {/* Bottom section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 text-center bg-navy-400/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Help Shape Our Future</h2>
          <p className="text-gray-300 mb-6">
            Our roadmap is constantly evolving based on community feedback. Have a suggestion
            or feature request? Let us know!
          </p>
          <button className="inline-flex items-center px-5 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Share Feedback
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
} 