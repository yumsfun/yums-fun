import Header from '@/components/Header';
import TokenCreationForm from '@/components/TokenCreationForm';

export default function CreateTokenPage() {
  return (
    <main className="min-h-screen bg-navy">
      <Header />
      
      <div className="container mx-auto px-4 py-16 relative">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-40 right-1/4 w-80 h-80 rounded-full bg-accent-purple/5 blur-3xl"></div>
          <div className="absolute top-40 right-1/3 w-6 h-6 rounded-full bg-primary/30 animate-float"></div>
          <div className="absolute top-60 left-1/3 w-4 h-4 rounded-full bg-accent-teal/30 animate-float delay-300"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-primary animate-fadeIn">Create Your Token</h1>
          <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto animate-fadeIn delay-100">Launch your own Solana token in minutes with no coding required. Set your parameters, customize your token, and deploy to the blockchain.</p>
          
          <TokenCreationForm />
        </div>
      </div>
    </main>
  );
} 