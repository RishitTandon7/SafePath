import React from 'react';
import { StatsOverview } from './StatsOverview';
import { ReportsList } from './ReportsList';
import { SafetyHotspots } from './SafetyHotspots';
import { TrendAnalysis } from './TrendAnalysis';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Safety Dashboard</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </div>
      </div>

      <StatsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsList />
        <SafetyHotspots />
      </div>

      <TrendAnalysis />
    </div>
  );
};