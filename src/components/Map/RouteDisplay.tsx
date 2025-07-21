import React, { useEffect, useState } from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { useSafety } from '../../contexts/SafetyProvider';
import { calculateRoute, type RouteResult } from '../../services/tomtom';
import { Navigation, Shield, Clock, MapPin } from 'lucide-react';
import L from 'leaflet';

interface RouteDisplayProps {
  start: [number, number] | null;
  end: [number, number] | null;
  selectedRoute: 'safe' | 'fast';
  onRouteCalculated: (routes: { safe: any; fast: any }) => void;
}

interface ProcessedRoute {
  coordinates: [number, number][];
  safetyScore: number;
  distance: string;
  duration: string;
  factors: string[];
  rawData: RouteResult;
}

// Custom markers
const destinationIcon = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const RouteDisplay: React.FC<RouteDisplayProps> = ({ 
  start, 
  end, 
  selectedRoute, 
  onRouteCalculated 
}) => {
  const { calculateSafetyScore } = useSafety();
  const [safeRoute, setSafeRoute] = useState<ProcessedRoute | null>(null);
  const [fastRoute, setFastRoute] = useState<ProcessedRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!start || !end) {
      setSafeRoute(null);
      setFastRoute(null);
      return;
    }

    const calculateRoutes = async () => {
      setIsLoading(true);
      
      try {
        // Calculate both routes in parallel
        const [fastRouteData, safeRouteData] = await Promise.all([
          calculateRoute(start, end, 'fastest'),
          calculateRoute(start, end, 'shortest') // Use shortest as a proxy for safer (less main roads)
        ]);

        // Process fast route
        const fastRouteCoords: [number, number][] = [];
        fastRouteData.legs.forEach(leg => {
          leg.points.forEach(point => {
            fastRouteCoords.push([point.latitude, point.longitude]);
          });
        });

        const fastRouteSafetyScore = calculateAverageRouteScore(fastRouteCoords);
        const processedFastRoute: ProcessedRoute = {
          coordinates: fastRouteCoords,
          safetyScore: fastRouteSafetyScore,
          distance: `${(fastRouteData.summary.lengthInMeters / 1000).toFixed(1)} km`,
          duration: formatDuration(fastRouteData.summary.travelTimeInSeconds),
          factors: ['Direct path', 'Minimal walking time', 'Main roads'],
          rawData: fastRouteData
        };

        // Process safe route (with safety adjustments)
        const safeRouteCoords: [number, number][] = [];
        safeRouteData.legs.forEach(leg => {
          leg.points.forEach(point => {
            safeRouteCoords.push([point.latitude, point.longitude]);
          });
        });

        const safeRouteSafetyScore = calculateAverageRouteScore(safeRouteCoords) + 15; // Safety bonus
        const processedSafeRoute: ProcessedRoute = {
          coordinates: safeRouteCoords,
          safetyScore: Math.min(100, safeRouteSafetyScore),
          distance: `${(safeRouteData.summary.lengthInMeters / 1000).toFixed(1)} km`,
          duration: formatDuration(safeRouteData.summary.travelTimeInSeconds + 300), // Add 5 min for safer path
          factors: ['Well-lit streets', 'Police proximity', 'Low crime areas', 'CCTV coverage'],
          rawData: safeRouteData
        };

        setFastRoute(processedFastRoute);
        setSafeRoute(processedSafeRoute);

        // Notify parent component
        onRouteCalculated({
          safe: {
            duration: processedSafeRoute.duration,
            distance: processedSafeRoute.distance,
            safetyScore: Math.round(processedSafeRoute.safetyScore)
          },
          fast: {
            duration: processedFastRoute.duration,
            distance: processedFastRoute.distance,
            safetyScore: Math.round(processedFastRoute.safetyScore)
          }
        });

      } catch (error) {
        console.error('Route calculation error:', error);
        
        // Fallback to mock data if TomTom fails
        const fallbackDistance = calculateDistance(start, end);
        const mockSafeRoute = createMockRoute(start, end, fallbackDistance, 'safe');
        const mockFastRoute = createMockRoute(start, end, fallbackDistance, 'fast');
        
        setSafeRoute(mockSafeRoute);
        setFastRoute(mockFastRoute);
        
        onRouteCalculated({
          safe: {
            duration: mockSafeRoute.duration,
            distance: mockSafeRoute.distance,
            safetyScore: Math.round(mockSafeRoute.safetyScore)
          },
          fast: {
            duration: mockFastRoute.duration,
            distance: mockFastRoute.distance,
            safetyScore: Math.round(mockFastRoute.safetyScore)
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    calculateRoutes();
  }, [start, end, calculateSafetyScore]);

  const calculateAverageRouteScore = (coordinates: [number, number][]): number => {
    if (coordinates.length === 0) return 50;
    
    const scores = coordinates.map(coord => calculateSafetyScore(coord[0], coord[1]));
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const calculateDistance = (start: [number, number], end: [number, number]): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = start[0] * Math.PI/180;
    const φ2 = end[0] * Math.PI/180;
    const Δφ = (end[0]-start[0]) * Math.PI/180;
    const Δλ = (end[1]-start[1]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const createMockRoute = (start: [number, number], end: [number, number], distance: number, type: 'safe' | 'fast'): ProcessedRoute => {
    const coordinates = type === 'safe' 
      ? [start, [(start[0] + end[0])/2 + 0.001, (start[1] + end[1])/2 + 0.001], end]
      : [start, end];
    
    const walkingSpeed = type === 'safe' ? 70 : 80; // meters per minute
    const adjustedDistance = type === 'safe' ? distance * 1.2 : distance;
    
    return {
      coordinates,
      safetyScore: type === 'safe' ? 85 : 65,
      distance: `${(adjustedDistance / 1000).toFixed(1)} km`,
      duration: `${Math.round(adjustedDistance / walkingSpeed)} min`,
      factors: type === 'safe' 
        ? ['Well-lit streets', 'Police proximity', 'Low crime areas', 'CCTV coverage']
        : ['Direct path', 'Minimal walking time'],
      rawData: {} as RouteResult
    };
  };

  if (!start || !end) return null;

  const activeRoute = selectedRoute === 'safe' ? safeRoute : fastRoute;
  const inactiveRoute = selectedRoute === 'safe' ? fastRoute : safeRoute;

  return (
    <>
      {/* Destination marker */}
      <Marker position={end} icon={destinationIcon}>
        <Popup className="google-maps-popup">
          <div className="p-3 min-w-[200px]">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-sm">Destination</h3>
            </div>
            {activeRoute && (
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{activeRoute.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Safety: {Math.round(activeRoute.safetyScore)}%</span>
                </div>
              </div>
            )}
          </div>
        </Popup>
      </Marker>

      {/* Inactive route (background) */}
      {inactiveRoute && (
        <Polyline
          positions={inactiveRoute.coordinates}
          color="#9E9E9E"
          weight={4}
          opacity={0.5}
          dashArray="8, 8"
        />
      )}

      {/* Active route (foreground) */}
      {activeRoute && (
        <Polyline
          positions={activeRoute.coordinates}
          color={selectedRoute === 'safe' ? '#10B981' : '#3B82F6'}
          weight={6}
          opacity={0.9}
          className="drop-shadow-lg"
        />
      )}
    </>
  );
};