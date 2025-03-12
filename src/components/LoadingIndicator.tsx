import { FC } from 'react';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ 
  message = 'Loading...', 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full border-t-2 border-primary border-r-2 border-b-2 border-transparent mr-3 ${sizeClasses[size]}"></div>
      {message && <span className="text-gray-300">{message}</span>}
    </div>
  );
};

export default LoadingIndicator; 