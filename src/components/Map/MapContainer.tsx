import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation as NavigationIcon } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyProvider';
import { useLocation } from '../../contexts/LocationContext';
import { SafetyHeatmap } from './SafetyHeatmap';
import { RouteDisplay } from './RouteDisplay';
import { MapControls } from './MapControls';
import { SearchInterface } from './SearchInterface';
import { PanicButton } from '../Safety/PanicButton';
import { SafetyInfoCard } from './SafetyInfoCard';
import { MapViewControls } from './MapViewControls';

// Fix for default Leaflet markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Professional Google Maps style marker for current location
const currentLocationIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzE5NzNGRiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const LocationMarker: React.FC = () => {
  const { currentLocation } = useLocation();
  const map = useMap();

  useEffect(() => {
    if (currentLocation) {
      map.setView(currentLocation, map.getZoom());
    }
  }, [currentLocation, map]);

  if (!currentLocation) return null;

  return (
    <Marker position={currentLocation} icon={currentLocationIcon}>
      <Popup className="google-maps-popup">
        <div className="p-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-sm">Your location</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Live tracking enabled
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

interface MapContainerProps {
  searchQuery?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({ searchQuery = '' }) => {
  const { reports } = useSafety();
  const { currentLocation, startTracking } = useLocation();
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routes, setRoutes] = useState<{
    safe: { duration: string; distance: string; safetyScore: number } | null;
    fast: { duration: string; distance: string; safetyScore: number } | null;
  }>({ safe: null, fast: null });
  const [selectedRoute, setSelectedRoute] = useState<'safe' | 'fast'>('safe');
  const [isNavigating, setIsNavigating] = useState(false);
  const [mapView, setMapView] = useState<'default' | 'satellite' | 'terrain'>('default');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showSearchInterface, setShowSearchInterface] = useState(false);

  useEffect(() => {
    startTracking();
  }, [startTracking]);

  const center: [number, number] = currentLocation || [40.7589, -73.9851];

  const handleRouteSearch = async (start: [number, number], end: [number, number]) => {
    setIsCalculatingRoute(true);
    setRouteStart(start);
    setRouteEnd(end);
    
    // The RouteDisplay component will handle the actual route calculation
    // and call handleRouteCalculated when done
  };

  const handleRouteCalculated = (calculatedRoutes: any) => {
    setRoutes(calculatedRoutes);
    setIsCalculatingRoute(false);
  };

  const clearRoutes = () => {
    setRouteStart(null);
    setRouteEnd(null);
    setRoutes({ safe: null, fast: null });
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleEndNavigation = () => {
    setIsNavigating(false);
  };

  const getTileLayerUrl = () => {
    switch (mapView) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapView) {
      case 'satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'terrain':
        return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  return (
    <div className="h-full relative">
      {/* Search Interface - Always available */}
      <div className="absolute top-4 left-4 z-30">
        <SearchInterface 
          onRouteSearch={handleRouteSearch}
          isCalculating={isCalculatingRoute}
          routes={routes}
          selectedRoute={selectedRoute}
          onRouteSelect={setSelectedRoute}
          onStartNavigation={handleStartNavigation}
          onEndNavigation={handleEndNavigation}
          isNavigating={isNavigating}
          searchQuery={searchQuery}
        />
      </div>

      {/* Directions Button - Quick Access */}
      {!showSearchInterface && !routeStart && !routeEnd && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => setShowSearchInterface(true)}
            className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2 text-blue-600 hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <NavigationIcon className="w-5 h-5" />
            <span className="font-medium">Get Directions</span>
          </button>
        </div>
      )}

      {/* Safety info card - Google Maps style */}
      <div className="absolute top-4 left-4 z-20">
        <SafetyInfoCard />
      </div>

      {/* Panic Button */}
      <PanicButton />
      
      <LeafletMapContainer
        center={center}
        zoom={16}
        className="h-full w-full relative z-10"
        zoomControl={false}
        style={{ background: '#f8fafc' }}
      >
        <TileLayer
          key={mapView}
          attribution={getTileLayerAttribution()}
          url={getTileLayerUrl()}
          className="map-tiles"
        />
        
        {/* Traffic Layer */}
        {showTraffic && (
          <TileLayer
            url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=YOUR_API_KEY"
            opacity={0.6}
          />
        )}

        {/* Transit Layer */}
        {showTransit && (
          <TileLayer
            url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=YOUR_API_KEY"
            opacity={0.4}
          />
        )}
        
        <LocationMarker />
        
        {showHeatmap && <SafetyHeatmap />}
        
        {routeStart && routeEnd && (
          <RouteDisplay 
            start={routeStart}
            end={routeEnd}
            selectedRoute={selectedRoute}
            onRouteCalculated={handleRouteCalculated}
          />
        )}

        {/* Enhanced Safety Reports Markers */}
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={report.location}
            icon={L.icon({
              iconUrl: report.severity === 'high' 
                ? 'https://maps.google.com/mapfiles/ms/icons/red-pushpin.png'
                : report.severity === 'medium' 
                ? 'https://maps.google.com/mapfiles/ms/icons/orange-pushpin.png'
                : 'https://maps.google.com/mapfiles/ms/icons/yellow-pushpin.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            })}
          >
            <Popup className="google-maps-popup">
              <div className="p-4 min-w-[250px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-base capitalize text-gray-900">
                    {report.type.replace('-', ' ')}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    report.severity === 'high' ? 'text-red-700 bg-red-100' :
                    report.severity === 'medium' ? 'text-yellow-700 bg-yellow-100' : 
                    'text-green-700 bg-green-100'
                  }`}>
                    {report.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">{report.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>Reported {new Date(report.timestamp).toLocaleDateString()}</span>
                  {report.verified && (
                    <span className="text-green-600 font-semibold flex items-center">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapControls 
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
          showHeatmap={showHeatmap}
          hasActiveRoute={!!(routeStart && routeEnd)}
          selectedRoute={selectedRoute}
          onClearRoutes={clearRoutes}
        />

        <MapViewControls 
          currentView={mapView}
          onViewChange={setMapView}
          showTraffic={showTraffic}
          onTrafficToggle={() => setShowTraffic(!showTraffic)}
          showTransit={showTransit}
          onTransitToggle={() => setShowTransit(!showTransit)}
          showSafety={showHeatmap}
          onSafetyToggle={() => setShowHeatmap(!showHeatmap)}
        />
      </LeafletMapContainer>
    </div>
  );
};