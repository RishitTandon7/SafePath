import React, { useState } from 'react';
import { Layers, Satellite, Car, Mountain, Bus, Shield, Eye } from 'lucide-react';
import { clsx } from 'clsx';

interface MapViewControlsProps {
  currentView: 'default' | 'satellite' | 'terrain';
  onViewChange: (view: 'default' | 'satellite' | 'terrain') => void;
  showTraffic: boolean;
  onTrafficToggle: () => void;
  showTransit: boolean;
  onTransitToggle: () => void;
  showSafety: boolean;
  onSafetyToggle: () => void;
}

export const MapViewControls: React.FC<MapViewControlsProps> = ({
  currentView,
  onViewChange,
  showTraffic,
  onTrafficToggle,
  showTransit,
  onTransitToggle,
  showSafety,
  onSafetyToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const viewOptions = [
    { key: 'default', label: 'Default', icon: Eye },
    { key: 'satellite', label: 'Satellite', icon: Satellite },
    { key: 'terrain', label: 'Terrain', icon: Mountain }
  ];

  const overlayOptions = [
    { key: 'traffic', label: 'Traffic', icon: Car, active: showTraffic, toggle: onTrafficToggle },
    { key: 'transit', label: 'Transit', icon: Bus, active: showTransit, toggle: onTransitToggle },
    { key: 'safety', label: 'Safety', icon: Shield, active: showSafety, toggle: onSafetyToggle }
  ];

  return (
    <div className="absolute bottom-6 right-6 z-30">
      {/* Layers Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 transition-all duration-200 hover:shadow-xl border border-gray-200',
          isOpen && 'bg-blue-50 text-blue-600 border-blue-200'
        )}
      >
        <Layers className="w-5 h-5" />
      </button>

      {/* Controls Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-48 animate-slide-in">
          {/* Map Views */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Map type</h3>
            <div className="grid grid-cols-1 gap-2">
              {viewOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => onViewChange(option.key as any)}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors',
                    currentView === option.key
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Overlays */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Layers</h3>
            <div className="space-y-1">
              {overlayOptions.map((overlay) => (
                <button
                  key={overlay.key}
                  onClick={overlay.toggle}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors w-full',
                    overlay.active
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                >
                  <overlay.icon className={clsx('w-4 h-4', overlay.active && 'text-green-600')} />
                  <span>{overlay.label}</span>
                  {overlay.active && (
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};