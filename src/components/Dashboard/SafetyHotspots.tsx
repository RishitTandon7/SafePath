import React from 'react';
import { MapPin, TrendingDown, TrendingUp } from 'lucide-react';

export const SafetyHotspots: React.FC = () => {
  const hotspots = [
    {
      id: '1',
      name: 'Central Park West',
      riskLevel: 'High',
      reports: 12,
      trend: 'up',
      coordinates: [40.7755, -73.9654]
    },
    {
      id: '2',
      name: 'Times Square Area',
      riskLevel: 'Medium',
      reports: 8,
      trend: 'down',
      coordinates: [40.7589, -73.9851]
    },
    {
      id: '3',
      name: 'East Village',
      riskLevel: 'Low',
      reports: 3,
      trend: 'down',
      coordinates: [40.7264, -73.9818]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Safety Hotspots</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {hotspots.map((hotspot) => (
          <div key={hotspot.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{hotspot.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(hotspot.riskLevel)}`}>
                    {hotspot.riskLevel} Risk
                  </span>
                  <span className="text-sm text-gray-600">
                    {hotspot.reports} reports
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {hotspot.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm font-medium ${
                  hotspot.trend === 'up' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {hotspot.trend === 'up' ? 'Rising' : 'Declining'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};