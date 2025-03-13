'use client';

import React, { useState } from 'react';

interface HowItWorksModalProps {
  buttonClassName?: string;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ buttonClassName = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* How It Works Button */}
      <button 
        onClick={openModal}
        className={`px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all duration-200 flex items-center gap-2 animate-bounceAndGlow hover:animate-none ${buttonClassName}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        How It Works
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300">
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl overflow-hidden animate-slideIn">
            {/* Modal Header */}
            <div className="p-5 border-b border-navy-600 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How Yums.Fun Works
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Creating Tokens Section */}
                <div>
                  <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary">1</span>
                    Creating Tokens
                  </h4>
                  <div className="ml-9 space-y-2 text-gray-300">
                    <p>Creating a new token on Yums.Fun is simple and fun:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Click the "Create Token" button in the navigation bar</li>
                      <li>Fill out the token details including name, symbol, and description</li>
                      <li>Upload a custom logo or use our generator</li>
                      <li>Set an initial market cap (this affects initial pricing)</li>
                      <li>Submit your token creation transaction</li>
                    </ol>
                    <p className="text-gray-400 text-sm mt-2">
                      Your token will be stored in our Firebase Realtime Database and immediately appear in the trending section.
                    </p>
                  </div>
                </div>

                {/* Buying Tokens Section */}
                <div>
                  <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary">2</span>
                    Buying Tokens
                  </h4>
                  <div className="ml-9 space-y-2 text-gray-300">
                    <p>When you find a token you'd like to invest in:</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Navigate to the token's detail page</li>
                      <li>Click the "Buy" button</li>
                      <li>Enter the amount you wish to purchase</li>
                      <li>Confirm your transaction</li>
                    </ol>
                    <p className="text-gray-400 text-sm mt-2">
                      Token prices are determined by a bonding curve algorithm - the more people buy, the higher the price goes. Early investors benefit the most!
                    </p>
                  </div>
                </div>

                {/* Token Economics Section */}
                <div>
                  <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary">3</span>
                    Token Economics
                  </h4>
                  <div className="ml-9 space-y-2 text-gray-300">
                    <p>Understanding how token values work:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>Each token follows a bonding curve pricing model</li>
                      <li>Market cap increases/decreases with buys/sells</li>
                      <li>Token creators earn a percentage of all transactions</li>
                      <li>The platform takes a small fee to maintain services</li>
                    </ul>
                    <p className="text-gray-400 text-sm mt-2">
                      All transactions are recorded in our database for transparency and real-time price updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-navy-600 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-5 py-2 bg-primary text-navy-900 rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HowItWorksModal; 