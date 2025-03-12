import { FC } from 'react';

interface SuccessMessageProps {
  message: string | null;
  className?: string;
}

const SuccessMessage: FC<SuccessMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`bg-teal/10 border border-teal/20 rounded-lg p-4 flex items-start text-sm mb-4 animate-fadeIn ${className}`}>
      <div className="flex-shrink-0 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1 text-teal pt-0.5">{message}</div>
    </div>
  );
};

export default SuccessMessage; 