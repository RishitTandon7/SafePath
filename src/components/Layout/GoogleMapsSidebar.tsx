import React from 'react';
import { X, Home, Briefcase, MapPin, Clock, Star, BarChart3, Shield, Settings, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface GoogleMapsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: 'map' | 'dashboard';
  onViewChange: (view: 'map' | 'dashboard') => void;
  onMenuItemClick: (item: string) => void;
}

export const GoogleMapsSidebar: React.FC<GoogleMapsSidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  onMenuItemClick
}) => {
  const savedPlaces = [
    { icon: Home, label: 'Home', address: 'Set home location', color: 'text-green-600' },
    { icon: Briefcase, label: 'Work', address: 'Set work location', color: 'text-blue-600' }
  ];

  const menuItems = [
    { icon: MapPin, label: 'Your places' },
    { icon: Clock, label: 'Recent' },
    { icon: Star, label: 'Saved routes' },
    { icon: BarChart3, label: 'Safety Dashboard' },
    { icon: Shield, label: 'Safety Reports' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help & feedback' }
  ];

  const handlePlaceClick = (place: string) => {
    onMenuItemClick(`set-${place.toLowerCase()}`);
    onClose();
  };

  const handleMenuItemClick = (item: string) => {
    if (item === 'Safety Dashboard') {
      onViewChange('dashboard');
    } else {
      onMenuItemClick(item.toLowerCase().replace(' & ', '-').replace(' ', '-'));
    }
    onClose();
  };

  return (
    <>
      <div className={clsx(
        'fixed md:relative top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SafePath AI
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Saved places */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Saved places
            </h3>
            <div className="space-y-1">
              {savedPlaces.map((place, index) => (
                <button
                  key={index}
                  onClick={() => handlePlaceClick(place.label)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className={`p-2 rounded-full bg-gray-100 ${place.color}`}>
                    <place.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{place.label}</p>
                    <p className="text-xs text-gray-500 truncate">{place.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Safety status */}
          <div className="p-4 border-b border-gray-200">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Safe area detected</span>
              </div>
              <p className="text-xs text-green-700">
                Current location has good lighting and low crime rates
              </p>
            </div>
          </div>

          {/* Menu items */}
          <div className="flex-1 p-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.label)}
                  className={clsx(
                    'w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left',
                    item.label === 'Safety Dashboard' && currentView === 'dashboard' && 'bg-blue-50'
                  )}
                >
                  <item.icon className={clsx(
                    'w-5 h-5',
                    item.label === 'Safety Dashboard' && currentView === 'dashboard' 
                      ? 'text-blue-600' 
                      : 'text-gray-400'
                  )} />
                  <span className={clsx(
                    'text-sm font-medium',
                    item.label === 'Safety Dashboard' && currentView === 'dashboard'
                      ? 'text-blue-600'
                      : 'text-gray-700'
                  )}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-center py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Get the SafePath app
            </button>
          </div>
        </div>
      </div>
    </>
  );
};