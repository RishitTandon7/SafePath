import React from 'react';
import { Shield, TrendingUp, MapPin, ChevronRight } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyProvider';
import { useLocation } from '../../contexts/LocationContext';

export const SafetyInfoCard: React.FC = () => {
  const { calculateSafetyScore } = useSafety();
  const { currentLocation } = useLocation();

  if (!currentLocation) return null;

  const safetyScore = calculateSafetyScore(currentLocation[0], currentLocation[1]);
  
  const getSafetyStatus = (score: number) => {
    if (score >= 70) return { text: 'Good safety in this area', color: 'green' };
    if (score >= 50) return { text: 'Moderate safety conditions', color: 'yellow' };
    return { text: 'Exercise caution in this area', color: 'red' };
  };

  const status = getSafetyStatus(safetyScore);

  return (
    <div className="w-80 max-w-[calc(100vw-2rem)] mt-20">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Main info */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              status.color === 'green' ? 'bg-green-500' : 
              status.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{status.text}</p>
              <p className="text-xs text-gray-500">Typical conditions</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Safety metrics */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xs font-medium text-gray-900">{Math.round(safetyScore)}%</p>
              <p className="text-xs text-gray-500">Safety</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-xs font-medium text-gray-900">+12%</p>
              <p className="text-xs text-gray-500">Trending</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <MapPin className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-xs font-medium text-gray-900">4.2km</p>
              <p className="text-xs text-gray-500">Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};