export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-500 text-white">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-navy-500 rounded-full flex items-center justify-center text-primary text-2xl font-bold">Y</div>
        </div>
        <h2 className="text-xl font-medium mb-2">Loading...</h2>
        <p className="text-gray-400 text-sm">Please wait while we fetch the data</p>
        
        <div className="mt-8 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
} 