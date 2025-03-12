'use client';

import { FC, useState, useEffect } from 'react';

interface PriceChartProps {
  tokenId: string;
}

const PriceChart: FC<PriceChartProps> = ({ tokenId }) => {
  const [timeframe, setTimeframe] = useState('24h');
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock data for the chart
  useEffect(() => {
    setIsLoading(true);

    // Generate random price data based on the selected timeframe
    const generateMockData = () => {
      const now = new Date();
      const data: { time: string; price: number }[] = [];
      
      let points = 24;
      let interval = 60; // minutes
      let basePrice = 0.005; // Base price in SOL
      let volatility = 0.2; // Price volatility factor
      
      // Adjust based on timeframe
      if (timeframe === '1h') {
        points = 60;
        interval = 1; // 1 minute intervals
        volatility = 0.05;
      } else if (timeframe === '24h') {
        points = 24;
        interval = 60; // 1 hour intervals
        volatility = 0.2;
      } else if (timeframe === '7d') {
        points = 7 * 24;
        interval = 60 * 4; // 4 hour intervals
        volatility = 0.4;
      } else if (timeframe === '30d') {
        points = 30;
        interval = 60 * 24; // 1 day intervals
        volatility = 0.7;
      }
      
      for (let i = 0; i < points; i++) {
        const time = new Date(now.getTime() - (points - i) * interval * 60000);
        const randomFactor = 1 + (Math.random() - 0.5) * volatility;
        const price = basePrice * randomFactor;
        
        data.push({
          time: time.toISOString(),
          price: price
        });
        
        // Update the base price for next iteration to create continuity
        basePrice = price;
      }
      
      return data;
    };

    // Simulate API call delay
    setTimeout(() => {
      setChartData(generateMockData());
      setIsLoading(false);
    }, 500);

  }, [timeframe, tokenId]);

  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (chartData.length < 2) return 0;
    
    const firstPrice = chartData[0].price;
    const currentPrice = chartData[chartData.length - 1].price;
    const percentChange = ((currentPrice - firstPrice) / firstPrice) * 100;
    
    return percentChange;
  };

  const priceChange = calculatePriceChange();
  const isPositive = priceChange >= 0;

  // Create a simple visualization of the chart
  const renderChart = () => {
    if (chartData.length === 0) return null;
    
    const highestPrice = Math.max(...chartData.map(d => d.price));
    const lowestPrice = Math.min(...chartData.map(d => d.price));
    const range = highestPrice - lowestPrice;
    
    const points = chartData.map((point, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - ((point.price - lowestPrice) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    const gradientId = `chart-gradient-${tokenId}`;
    
    return (
      <div className="relative w-full h-64 mt-4">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Gradient for area under the line */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'} />
              <stop offset="100%" stopColor="rgba(26, 27, 37, 0)" />
            </linearGradient>
          </defs>
          
          {/* Area under the line */}
          <polygon 
            points={`0,100 ${points} 100,100`} 
            fill={`url(#${gradientId})`}
          />
          
          {/* Line */}
          <polyline 
            points={points} 
            fill="none" 
            stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} 
            strokeWidth="1.5" 
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-navy-600 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Price Chart</h3>
        
        <div className="flex rounded-lg overflow-hidden border border-navy-500">
          {['1h', '24h', '7d', '30d'].map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1 text-sm ${
                timeframe === tf
                  ? 'bg-primary text-navy font-medium'
                  : 'bg-navy-700 text-gray-400 hover:bg-navy-500'
              }`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">
                {chartData[chartData.length - 1]?.price.toFixed(6)}
              </span>
              <span className="ml-2 text-gray-400">SOL</span>
              
              <span className={`ml-4 ${isPositive ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
            
            <div className="text-xs text-gray-400 mt-1">
              = ${(chartData[chartData.length - 1]?.price * 100).toFixed(2)} USD
            </div>
          </div>
          
          {renderChart()}
          
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {['1h', '24h', '7d', '30d'].includes(timeframe) ? (
              <>
                <span>
                  {new Date(chartData[0].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>
                  {new Date(chartData[Math.floor(chartData.length / 3)].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>
                  {new Date(chartData[Math.floor(chartData.length * 2 / 3)].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>
                  {new Date(chartData[chartData.length - 1].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            ) : (
              <>
                <span>
                  {new Date(chartData[0].time).toLocaleDateString()}
                </span>
                <span>
                  {new Date(chartData[Math.floor(chartData.length / 3)].time).toLocaleDateString()}
                </span>
                <span>
                  {new Date(chartData[Math.floor(chartData.length * 2 / 3)].time).toLocaleDateString()}
                </span>
                <span>
                  {new Date(chartData[chartData.length - 1].time).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PriceChart; 