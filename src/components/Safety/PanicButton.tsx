import React, { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { useLocation } from '../../contexts/LocationContext';
import { clsx } from 'clsx';

interface PanicButtonProps {
  className?: string;
}

export const PanicButton: React.FC<PanicButtonProps> = ({ className }) => {
  const { triggerPanic, currentLocation } = useLocation();
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handlePanicPress = () => {
    setIsPressed(true);
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          triggerPanic();
          setIsPressed(false);
          setCountdown(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setIsPressed(false);
    setCountdown(null);
  };

  if (isPressed) {
    return (
      <div className={clsx('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50', className)}>
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Emergency Alert in {countdown}s</h3>
          <p className="text-gray-600 mb-4">
            Your emergency contacts will be notified with your location.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                triggerPanic();
                setIsPressed(false);
                setCountdown(null);
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Send Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handlePanicPress}
        className="w-20 h-20 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-full shadow-2xl shadow-red-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 transform animate-pulse-glow"
        aria-label="Emergency panic button"
      >
        <div className="relative">
          <AlertTriangle className="w-8 h-8 drop-shadow-lg" />
          <div className="absolute -inset-3 rounded-full bg-red-400/40 animate-ping"></div>
          <div className="absolute -inset-1 rounded-full bg-red-300/30 animate-ping animation-delay-150"></div>
        </div>
      </button>
      </div>
  );
};