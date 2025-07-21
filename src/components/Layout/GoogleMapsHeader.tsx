import React from 'react';
import { Menu, Search, Shield, AlertTriangle, Users, TrendingUp, Navigation, MapPin } from 'lucide-react';

interface GoogleMapsHeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReportClick: () => void;
  onCategoryClick: (category: string) => void;
}

export const GoogleMapsHeader: React.FC<GoogleMapsHeaderProps> = ({
  onMenuClick,
  searchQuery,
  onSearchChange,
  onReportClick,
  onCategoryClick
}) => {
  const categories = [
    { icon: Shield, label: 'Safe Routes', color: 'text-green-600' },
    { icon: AlertTriangle, label: 'Reports', color: 'text-red-600', onClick: onReportClick },
    { icon: Users, label: 'Community', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Analytics', color: 'text-purple-600' },
    { icon: Navigation, label: 'Navigation', color: 'text-indigo-600' },
    { icon: MapPin, label: 'Places', color: 'text-orange-600' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      {/* Main header */}
      <div className="flex items-center px-4 py-3">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search SafePath"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* SafePath AI branding */}
        <div className="hidden md:flex items-center space-x-3 ml-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SafePath AI
          </span>
        </div>
      </div>

      {/* Category buttons */}
      <div className="px-4 pb-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                if (category.label === 'Reports') {
                  onReportClick();
                } else {
                  onCategoryClick(category.label);
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full whitespace-nowrap transition-all duration-200 hover:shadow-md hover:scale-105 transform"
            >
              <category.icon className={`w-4 h-4 ${category.color}`} />
              <span className="text-sm font-medium text-gray-700">{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};