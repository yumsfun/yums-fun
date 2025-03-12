import Header from '@/components/Header';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-10">How <span className="text-primary">yums.fun</span> Works</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-primary text-navy rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
              Connect Your Wallet
            </h2>
            <p className="text-gray-300 mb-4">
              To get started with yums.fun, you'll need to connect your Solana wallet. We support popular wallets like Phantom and Solflare.
              This allows you to create tokens, buy and sell, and manage your portfolio.
            </p>
            <div className="bg-navy-600 rounded-xl p-4">
              <p className="text-sm text-gray-400">
                <strong className="text-primary">Tip:</strong> Make sure you have some SOL in your wallet to cover transaction fees and token creation costs.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-primary text-navy rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
              Create Your Token
            </h2>
            <p className="text-gray-300 mb-4">
              Creating a memecoin on yums.fun is simple and takes just a few minutes. You'll need to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4 pl-4">
              <li>Choose a name and symbol for your token</li>
              <li>Upload a logo image (optional but recommended)</li>
              <li>Set the initial supply and other parameters</li>
              <li>Pay a small fee in SOL to cover deployment costs</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Once created, your token will be immediately available for trading on the platform.
            </p>
            <div className="bg-navy-600 rounded-xl p-4">
              <p className="text-sm text-gray-400">
                <strong className="text-primary">Tip:</strong> Choose a catchy name and symbol that stands out. A good logo can make your token more appealing to traders.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-primary text-navy rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
              Trade Tokens
            </h2>
            <p className="text-gray-300 mb-4">
              yums.fun makes it easy to buy and sell memecoins:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4 pl-4">
              <li>Browse trending tokens on the homepage</li>
              <li>View detailed information and price charts on token pages</li>
              <li>Buy tokens with SOL directly on the platform</li>
              <li>Sell tokens back to SOL when you're ready</li>
            </ul>
            <p className="text-gray-300 mb-4">
              All trades happen on-chain using Solana's fast and low-cost network.
            </p>
            <div className="bg-navy-600 rounded-xl p-4">
              <p className="text-sm text-gray-400">
                <strong className="text-primary">Tip:</strong> Add tokens to your watchlist to keep track of their performance over time.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-primary text-navy rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
              Grow Your Community
            </h2>
            <p className="text-gray-300 mb-4">
              The success of a memecoin often depends on its community. Here's how to grow yours:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4 pl-4">
              <li>Share your token on social media platforms</li>
              <li>Engage with your community through comments on your token page</li>
              <li>Create content and memes related to your token</li>
              <li>Consider airdrops or community events to increase engagement</li>
            </ul>
            <div className="bg-navy-600 rounded-xl p-4">
              <p className="text-sm text-gray-400">
                <strong className="text-primary">Tip:</strong> Building a strong community takes time. Be patient and consistent with your engagement efforts.
              </p>
            </div>
          </section>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to get started?</h2>
          <Link href="/create" className="btn btn-primary text-lg px-8 py-3">
            Create Your Token
          </Link>
        </div>
      </div>
    </main>
  );
} 