import React from 'react';
import { Layers, Shield, Plus, Minus, Crosshair, X, Navigation } from 'lucide-react';
import { clsx } from 'clsx';
import { useMap } from 'react-leaflet';

interface MapControlsProps {
  onToggleHeatmap: () => void;
  showHeatmap: boolean;
  hasActiveRoute: boolean;
  selectedRoute: 'safe' | 'fast';
  onClearRoutes: () => void;
  isNavigating?: boolean;
}

const ZoomControls: React.FC = () => {
  const map = useMap();

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();

  return (
    <div className="professional-card overflow-hidden">
      <button 
        onClick={zoomIn}
        className="w-14 h-14 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-gray-100/50 transition-all duration-300 hover:scale-110 transform shadow-inner"
        aria-label="Zoom in"
      >
        <Plus className="w-6 h-6 font-bold drop-shadow-sm" />
      </button>
      <button 
        onClick={zoomOut}
        className="w-14 h-14 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:scale-110 transform shadow-inner"
        aria-label="Zoom out"
      >
        <Minus className="w-6 h-6 font-bold drop-shadow-sm" />
      </button>
    </div>
  );
};

const MyLocationControl: React.FC = () => {
  const map = useMap();

  const centerOnLocation = () => {
    if (navigator.geolocation) {
      const button = document.activeElement as HTMLButtonElement;
      button?.blur(); // Remove focus to show loading state
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 16);
          // Show success feedback
          const event = new CustomEvent('location-found', { 
            detail: { lat: latitude, lng: longitude } 
          });
          window.dispatchEvent(event);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check location permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <button 
      onClick={centerOnLocation}
      className="w-14 h-14 professional-card flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-2xl hover:scale-110 transform"
      aria-label="Center on my location"
    >
      <Crosshair className="w-6 h-6 font-bold drop-shadow-sm" />
    </button>
  );
};

export const MapControls: React.FC<MapControlsProps> = ({
  onToggleHeatmap,
  showHeatmap,
  hasActiveRoute,
  selectedRoute,
  onClearRoutes,
  isNavigating = false
}) => {
  return (
    <div className="absolute top-20 right-6 z-40 space-y-4">
      {/* Zoom Controls */}
      <ZoomControls />

      {/* My Location Control */}
      <MyLocationControl />

      {/* Safety Layer Toggle */}
      <button
        onClick={onToggleHeatmap}
        className={clsx(
          'flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-xl text-sm font-bold transition-all duration-300 border hover:scale-105 transform',
          showHeatmap
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-blue-500/30'
            : 'bg-white/98 backdrop-blur-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-gray-100/50 hover:shadow-2xl'
        )}
        aria-label="Toggle safety heatmap"
      >
        <Layers className="w-5 h-5 drop-shadow-sm" />
        <span>Safety Layer</span>
      </button>

      {/* Active Route Info */}
      {hasActiveRoute && (
        <div className="professional-card p-6 max-w-xs z-40 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedRoute === 'safe' ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30' : 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30'
              }`}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Active Route</span>
            </div>
            <button
              onClick={onClearRoutes}
              className="p-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 hover:scale-110 transform shadow-sm"
              aria-label="Clear route"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className={clsx(
              'flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-lg',
              selectedRoute === 'safe' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 shadow-green-500/10' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 shadow-blue-500/10'
            )}>
              {selectedRoute === 'safe' ? (
                <Shield className="w-5 h-5 text-green-600 font-bold drop-shadow-sm" />
              ) : (
                <Navigation className="w-5 h-5 text-blue-600 font-bold drop-shadow-sm" />
              )}
              <span className={clsx(
                'text-base font-bold',
                selectedRoute === 'safe' ? 'text-green-700' : 'text-blue-700'
              )}>
                {selectedRoute === 'safe' ? 'Safest Path' : 'Fastest Path'}
              </span>
            </div>
            
            <div className="text-xs text-gray-600 leading-relaxed bg-white/80 rounded-xl px-4 py-3 shadow-inner border border-gray-100/50">
              {selectedRoute === 'safe' 
                ? 'Route optimized for safety with well-lit streets and police proximity'
                : 'Direct route with minimal detours for fastest travel time'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};