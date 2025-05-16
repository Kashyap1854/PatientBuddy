import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 0.5;
      });
    }, 25);
    
    return () => clearInterval(timer);
  }, []);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-error-500" size={20} />;
      case 'info':
        return <Info className="text-primary-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-warning-500" size={20} />;
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-success-50 border-l-4 border-success-500';
      case 'error': return 'bg-error-50 border-l-4 border-error-500';
      case 'info': return 'bg-primary-50 border-l-4 border-primary-500';
      case 'warning': return 'bg-warning-50 border-l-4 border-warning-500';
    }
  };
  
  return (
    <div 
      className={`w-72 md:w-80 shadow-md rounded-md overflow-hidden animate-slide-up ${getBackgroundColor()}`}
    >
      <div className="p-3 flex items-start">
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 pr-2">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Progress bar */}
      <div 
        className={`h-1 ${
          type === 'success' ? 'bg-success-500' : 
          type === 'error' ? 'bg-error-500' : 
          type === 'info' ? 'bg-primary-500' : 
          'bg-warning-500'
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}