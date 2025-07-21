import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  currentLocation: [number, number] | null;
  isTracking: boolean;
  emergencyContacts: string[];
  startTracking: () => void;
  stopTracking: () => void;
  triggerPanic: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [emergencyContacts] = useState<string[]>(['+1234567890', '+1987654321']);

  useEffect(() => {
    if (isTracking && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const triggerPanic = () => {
    // In production, this would trigger SMS/WhatsApp alerts
    console.log('PANIC TRIGGERED - Alerting emergency contacts:', emergencyContacts);
    if (currentLocation) {
      const message = `EMERGENCY: User needs help at location: https://maps.google.com/?q=${currentLocation[0]},${currentLocation[1]}`;
      console.log('Emergency message:', message);
    }
  };

  return (
    <LocationContext.Provider value={{
      currentLocation,
      isTracking,
      emergencyContacts,
      startTracking,
      stopTracking,
      triggerPanic
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};