'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

/**
 * Toast Notification Component
 * 
 * Displays temporary notification messages to users
 * Auto-dismisses after specified duration
 */
export default function Toast({ 
  message, 
  type = 'info', 
  duration = 5000,
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
    info: <Info className="w-5 h-5" aria-hidden="true" />,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const iconStyles = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-4 right-4 z-50 max-w-md w-full p-4 rounded-lg border shadow-lg ${styles[type]} animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <div className={iconStyles[type]}>
          {icons[type]}
        </div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
