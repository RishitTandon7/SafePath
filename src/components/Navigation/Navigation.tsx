import React from 'react';
import { Map, BarChart3, AlertTriangle, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface NavigationProps {
  currentView: 'map' | 'dashboard' | 'reports';
  onViewChange: (view: 'map' | 'dashboard' | 'reports') => void;
  onReportClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onReportClick
}) => {
  return (
    <nav className="bg-white/98 backdrop-blur-xl border-b border-gray-100/80 px-6 py-5 shadow-xl shadow-gray-900/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 animate-pulse-glow">
            <span className="text-white font-bold text-xl drop-shadow-lg">🛡️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">SafePath AI</h1>
            <p className="text-xs text-gray-500 -mt-1 font-medium tracking-wide">Safe Navigation for All</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewChange('map')}
            className={clsx(
              'flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg',
              currentView === 'map'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30'
                : 'text-gray-600 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-gray-200/50 hover:shadow-xl'
            )}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={clsx(
              'flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg',
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30'
                : 'text-gray-600 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-gray-200/50 hover:shadow-xl'
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={onReportClick}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 transform"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>
    </nav>
  );
};