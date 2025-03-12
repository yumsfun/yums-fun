'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ClientWalletButton() {
  // Use state to track if we're on the client
  const [mounted, setMounted] = useState(false);

  // When the component mounts, we're on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the button on the client side
  if (!mounted) {
    // Return a placeholder with the same dimensions and styling
    return (
      <button 
        className="!bg-primary !text-navy-700 hover:!bg-primary-400 !rounded-full !text-sm !font-medium !py-1.5 !px-4 !transition-all hover:!shadow-md hover:!-translate-y-0.5"
        disabled
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <WalletMultiButton className="!bg-primary !text-navy-700 hover:!bg-primary-400 !rounded-full !text-sm !font-medium !py-1.5 !px-4 !transition-all hover:!shadow-md hover:!-translate-y-0.5" />
  );
} 