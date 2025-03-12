import { FC } from 'react';

interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`bg-red/10 border border-red/20 rounded-lg p-4 flex items-start text-sm mb-4 animate-fadeIn ${className}`}>
      <div className="flex-shrink-0 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1 text-red pt-0.5">{message}</div>
    </div>
  );
};

export default ErrorMessage; 