const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const BASE_URL = 'https://api.tomtom.com';

export interface GeocodingResult {
  id: string;
  address: {
    freeformAddress: string;
    country: string;
    municipality?: string;
  };
  position: {
    lat: number;
    lon: number;
  };
  score: number;
}

export interface RouteResult {
  summary: {
    lengthInMeters: number;
    travelTimeInSeconds: number;
    trafficDelayInSeconds: number;
  };
  legs: Array<{
    points: Array<{
      latitude: number;
      longitude: number;
    }>;
  }>;
}

export const geocodeLocation = async (query: string): Promise<GeocodingResult[]> => {
  if (!TOMTOM_API_KEY) {
    throw new Error('TomTom API key not configured');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/2/geocode/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=5`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

export const calculateRoute = async (
  start: [number, number],
  end: [number, number],
  routeType: 'fastest' | 'shortest' | 'eco' = 'fastest'
): Promise<RouteResult> => {
  if (!TOMTOM_API_KEY) {
    throw new Error('TomTom API key not configured');
  }

  try {
    const startCoords = `${start[0]},${start[1]}`;
    const endCoords = `${end[0]},${end[1]}`;
    
    const response = await fetch(
      `${BASE_URL}/routing/1/calculateRoute/${startCoords}:${endCoords}/json?key=${TOMTOM_API_KEY}&routeType=${routeType}&traffic=true&travelMode=pedestrian`
    );
    
    if (!response.ok) {
      throw new Error(`Routing failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.routes[0];
  } catch (error) {
    console.error('Routing error:', error);
    throw error;
  }
};

export const searchNearby = async (
  coordinates: [number, number],
  category: string,
  radius: number = 1000
): Promise<any[]> => {
  if (!TOMTOM_API_KEY) {
    throw new Error('TomTom API key not configured');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/2/nearbySearch/.json?key=${TOMTOM_API_KEY}&lat=${coordinates[0]}&lon=${coordinates[1]}&radius=${radius}&categorySet=${category}`
    );
    
    if (!response.ok) {
      throw new Error(`Nearby search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Nearby search error:', error);
    throw error;
  }
};