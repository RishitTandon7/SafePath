import React, { useEffect, useState } from 'react';
import { MapPin, Shield, ShieldAlert } from 'lucide-react';
import { useLocation } from '../../contexts/LocationContext';
import { useSafety } from '../../contexts/SafetyProvider';

export const LocationTracker: React.FC = () => {
  const { currentLocation, isTracking } = useLocation();
  const { calculateSafetyScore } = useSafety();
  const [currentSafetyScore, setCurrentSafetyScore] = useState<number>(50);

  useEffect(() => {
    if (currentLocation) {
      const score = calculateSafetyScore(currentLocation[0], currentLocation[1]);
      setCurrentSafetyScore(score);
    }
  }, [currentLocation, calculateSafetyScore]);

  if (!isTracking || !currentLocation) {
    return null;
  }

  const getSafetyColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyIcon = (score: number) => {
    if (score >= 70) return Shield;
    return ShieldAlert;
  };

  const SafetyIcon = getSafetyIcon(currentSafetyScore);

  return (
    <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-5 w-56 pointer-events-none overflow-hidden animate-slide-in">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-purple-50/60 rounded-2xl"></div>
      
      <div className="relative">
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 w-4 h-4 bg-blue-400/50 rounded-full animate-ping"></div>
          </div>
          <span className="font-bold text-sm bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Live Tracking</span>
        </div>
      
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-1.5 rounded-lg ${
            currentSafetyScore >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' : 
            currentSafetyScore >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30' : 
            'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/30'
          }`}>
            <SafetyIcon className="w-4 h-4 text-white drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 font-medium">Safety Score</span>
            <span className={`text-sm font-bold ${getSafetyColor(currentSafetyScore)}`}>
            {currentSafetyScore >= 70 ? 'Good' : currentSafetyScore >= 50 ? 'Fair' : 'Poor'}
          </span>
          </div>
        </div>
      
        <div className="w-full bg-gray-200/70 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
          <div 
            className={`h-4 rounded-full transition-all duration-700 ease-out ${
            currentSafetyScore >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
            currentSafetyScore >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
          }`}
            style={{ 
              width: `${currentSafetyScore}%`,
              boxShadow: currentSafetyScore >= 70 
                ? '0 2px 8px rgba(16, 185, 129, 0.4)' 
                : currentSafetyScore >= 50 
                ? '0 2px 8px rgba(245, 158, 11, 0.4)' 
                : '0 2px 8px rgba(239, 68, 68, 0.4)'
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-white/40 to-transparent rounded-full"></div>
          </div>
        </div>
      
        <div className={`text-xs font-semibold px-4 py-3 rounded-xl shadow-inner ${
          currentSafetyScore >= 70 ? 'text-green-800 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50' : 
          currentSafetyScore >= 50 ? 'text-yellow-800 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50' : 
          'text-red-800 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              currentSafetyScore >= 70 ? 'bg-green-500 animate-pulse' : 
              currentSafetyScore >= 50 ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500 animate-pulse'
            }`}></div>
            <span>
              {currentSafetyScore >= 70 
            ? '✓ Safe area - stay aware' 
          : currentSafetyScore >= 50 
            ? '⚠ Stay alert in this area' 
            : '⚡ Consider alternate route'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};