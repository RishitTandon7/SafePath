import React, { useState, useRef, useEffect } from 'react';
import { Search, Navigation, MapPin, Clock, Shield, ChevronDown, Loader2, X, Play, Square, ArrowLeft, Star, Route } from 'lucide-react';
import { clsx } from 'clsx';
import { geocodeLocation, type GeocodingResult } from '../../services/tomtom';

interface SearchInterfaceProps {
  onRouteSearch: (start: [number, number], end: [number, number]) => void;
  isCalculating: boolean;
  routes: {
    safe: { duration: string; distance: string; safetyScore: number } | null;
    fast: { duration: string; distance: string; safetyScore: number } | null;
  };
  selectedRoute: 'safe' | 'fast';
  onRouteSelect: (route: 'safe' | 'fast') => void;
  onStartNavigation?: () => void;
  onEndNavigation?: () => void;
  isNavigating?: boolean;
  searchQuery?: string;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onRouteSearch,
  isCalculating,
  routes,
  selectedRoute,
  onRouteSelect,
  onStartNavigation,
  onEndNavigation,
  isNavigating = false
}) => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<GeocodingResult[]>([]);
  const [toSuggestions, setToSuggestions] = useState<GeocodingResult[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [navigationStep, setNavigationStep] = useState(0);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (query: string, setResults: (results: GeocodingResult[]) => void) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await geocodeLocation(query);
      setResults(results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFromChange = (value: string) => {
    setFromValue(value);
    searchLocations(value, setFromSuggestions);
    setShowFromSuggestions(true);
  };

  const handleToChange = (value: string) => {
    setToValue(value);
    searchLocations(value, setToSuggestions);
    setShowToSuggestions(true);
  };

  const selectFromLocation = (result: GeocodingResult) => {
    setFromValue(result.address.freeformAddress);
    setShowFromSuggestions(false);
  };

  const selectToLocation = (result: GeocodingResult) => {
    setToValue(result.address.freeformAddress);
    setShowToSuggestions(false);
  };

  const handleSearch = async () => {
    if (!fromValue.trim() || !toValue.trim()) return;

    setIsLoadingDirections(true);
    try {
      const [fromResults, toResults] = await Promise.all([
        geocodeLocation(fromValue),
        geocodeLocation(toValue)
      ]);

      if (fromResults.length > 0 && toResults.length > 0) {
        const start: [number, number] = [fromResults[0].position.lat, fromResults[0].position.lon];
        const end: [number, number] = [toResults[0].position.lat, toResults[0].position.lon];
        
        onRouteSearch(start, end);
        setShowRouteOptions(true);
      }
    } catch (error) {
      console.error('Route search error:', error);
    } finally {
      setIsLoadingDirections(false);
    }
  };

  const clearSearch = () => {
    setFromValue('');
    setToValue('');
    setFromSuggestions([]);
    setToSuggestions([]);
    setShowRouteOptions(false);
    setIsLoadingDirections(false);
  };

  const handleStartJourney = () => {
    if (onStartNavigation) {
      onStartNavigation();
      setNavigationStep(1);
    }
  };

  const handleEndNavigation = () => {
    if (onEndNavigation) {
      onEndNavigation();
      setNavigationStep(0);
    }
  };

  // Mock navigation instructions
  const navigationInstructions = [
    "Head northeast on Current Street",
    "Turn right onto Main Road",
    "Continue straight for 0.5 km",
    "Turn left onto Safe Avenue",
    "Destination will be on your right"
  ];

  // Navigation mode interface
  if (isNavigating) {
    return (
      <div className="w-full max-w-sm professional-card animate-slide-in">
        {/* Navigation Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
          <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="font-semibold">Live Navigation</span>
            </div>
            <button
              onClick={handleEndNavigation}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Instruction */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-xs font-medium opacity-90">In 200m</div>
              </div>
              <div className="font-semibold text-lg leading-tight">
              {navigationInstructions[Math.min(navigationStep, navigationInstructions.length - 1)]}
            </div>
          </div>
          </div>
        </div>

        {/* Navigation Stats */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {routes[selectedRoute]?.duration || '12 min'}
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">ETA</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {routes[selectedRoute]?.distance || '1.2 km'}
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Distance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {routes[selectedRoute]?.safetyScore || 85}%
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Safety</div>
            </div>
          </div>

          {/* Route Type */}
          <div className="flex justify-center">
            <div className={clsx(
              'px-4 py-2 rounded-full text-sm font-semibold shadow-lg',
              selectedRoute === 'safe' 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
            )}>
              {selectedRoute === 'safe' ? '🛡️ Safest route' : '⚡ Fastest route'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Route options view (Google Maps style)
  if (showRouteOptions && (routes.safe || routes.fast)) {
    return (
      <div className="w-full max-w-sm professional-card animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowRouteOptions(false)}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-semibold text-gray-900 text-lg">Choose route</h2>
            <button
              onClick={clearSearch}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Route Options */}
        <div className="p-6 space-y-4">
          {/* Safest Route */}
          {routes.safe && (
            <button
              onClick={() => onRouteSelect('safe')}
              className={clsx(
                'w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02]',
                selectedRoute === 'safe'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-500/20'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-lg hover:shadow-green-500/10'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">Safest</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-lg">{routes.safe.duration}</div>
                  <div className="text-sm text-gray-500 font-medium">{routes.safe.distance}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Well-lit • Low crime</span>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-600 fill-current" />
                    <span className="text-xs font-semibold text-yellow-700">{routes.safe.safetyScore}%</span>
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* Fastest Route */}
          {routes.fast && (
            <button
              onClick={() => onRouteSelect('fast')}
              className={clsx(
                'w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02]',
                selectedRoute === 'fast'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg hover:shadow-blue-500/10'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">Fastest</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-lg">{routes.fast.duration}</div>
                  <div className="text-sm text-gray-500 font-medium">{routes.fast.distance}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Direct route</span>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-600 fill-current" />
                    <span className="text-xs font-semibold text-yellow-700">{routes.fast.safetyScore}%</span>
                  </div>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Start Button - Google Maps Style */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-b-2xl">
          <button
            onClick={handleStartJourney}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02]"
          >
            <div className="p-1 bg-white/20 rounded-full">
              <Play className="w-5 h-5" />
            </div>
            <span className="text-lg">Start Navigation</span>
          </button>
        </div>
      </div>
    );
  }

  // Main search interface
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 animate-slide-in">
      {/* Search Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Route className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SafePath Directions</h2>
              <p className="text-xs text-gray-500">Find the safest route</p>
            </div>
          </div>
          {(fromValue || toValue) && (
            <button
              onClick={clearSearch}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* From Input */}
        <div ref={fromRef} className="relative mb-4">
          <div className="relative">
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg"></div>
            </div>
            <input
              type="text"
              placeholder="Your location"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              className="w-full pl-14 pr-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-gray-50 focus:bg-white transition-all duration-200 shadow-inner focus:shadow-lg"
            />
            {isSearching && (
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          
          {showFromSuggestions && fromSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto suggestion-list">
              {fromSuggestions.map((result) => (
                <button
                  key={result.id}
                  onClick={() => selectFromLocation(result)}
                  className="w-full px-5 py-4 text-left hover:bg-blue-50 border-b border-gray-50 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl transition-all duration-200 hover:scale-[1.01] transform"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{result.address.freeformAddress}</p>
                      {result.address.municipality && (
                        <p className="text-xs text-gray-500">{result.address.municipality}, {result.address.country}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* To Input */}
        <div ref={toRef} className="relative">
          <div className="relative">
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
              <div className="p-1 bg-red-100 rounded-lg">
                <MapPin className="w-3 h-3 text-red-500" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Choose destination"
              value={toValue}
              onChange={(e) => handleToChange(e.target.value)}
              className="w-full pl-14 pr-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-gray-50 focus:bg-white transition-all duration-200 shadow-inner focus:shadow-lg"
            />
            {isSearching && (
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          
          {showToSuggestions && toSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto suggestion-list">
              {toSuggestions.map((result) => (
                <button
                  key={result.id}
                  onClick={() => selectToLocation(result)}
                  className="w-full px-5 py-4 text-left hover:bg-blue-50 border-b border-gray-50 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl transition-all duration-200 hover:scale-[1.01] transform"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{result.address.freeformAddress}</p>
                      {result.address.municipality && (
                        <p className="text-xs text-gray-500">{result.address.municipality}, {result.address.country}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        {isLoadingDirections && (
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full pulse-dot"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full pulse-dot"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full pulse-dot"></div>
              </div>
              <span className="text-blue-700 font-medium">Finding best routes...</span>
            </div>
          </div>
        )}
        
        <button
          onClick={handleSearch}
          disabled={!fromValue.trim() || !toValue.trim() || isCalculating || isSearching || isLoadingDirections}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold text-base flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] disabled:transform-none disabled:shadow-none"
        >
          {isCalculating || isLoadingDirections ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Finding Routes</span>
            </>
          ) : isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching</span>
            </>
          ) : (
            <>
              <div className="p-1 bg-white/20 rounded-full">
                <Search className="w-4 h-4" />
              </div>
              <span>Get Directions</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};