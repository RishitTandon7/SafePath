import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SafetyReport {
  id: string;
  type: 'harassment' | 'poor-lighting' | 'crime' | 'unsafe-area' | 'other';
  location: [number, number];
  description: string;
  timestamp: Date;
  verified: boolean;
  severity: 'low' | 'medium' | 'high';
}

export interface SafetyData {
  crimeRate: number;
  lightingQuality: number;
  policeProximity: number;
  crowdReports: number;
  overallScore: number;
}

interface SafetyContextType {
  reports: SafetyReport[];
  safetyData: Map<string, SafetyData>;
  addReport: (report: Omit<SafetyReport, 'id' | 'timestamp'>) => void;
  calculateSafetyScore: (lat: number, lng: number) => number;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [safetyData, setSafetyData] = useState<Map<string, SafetyData>>(new Map());

  // Mock data initialization
  useEffect(() => {
    const mockReports: SafetyReport[] = [
      {
        id: '1',
        type: 'poor-lighting',
        location: [40.7589, -73.9851],
        description: 'Very dark alley with broken streetlights',
        timestamp: new Date(Date.now() - 86400000),
        verified: true,
        severity: 'high'
      },
      {
        id: '2',
        type: 'harassment',
        location: [40.7614, -73.9776],
        description: 'Unwanted attention from individuals',
        timestamp: new Date(Date.now() - 172800000),
        verified: true,
        severity: 'medium'
      }
    ];

    setReports(mockReports);

    // Mock safety data for NYC area
    const mockSafetyData = new Map<string, SafetyData>();
    for (let lat = 40.7; lat < 40.8; lat += 0.01) {
      for (let lng = -74.0; lng < -73.9; lng += 0.01) {
        const key = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
        mockSafetyData.set(key, {
          crimeRate: Math.random() * 100,
          lightingQuality: Math.random() * 100,
          policeProximity: Math.random() * 100,
          crowdReports: Math.floor(Math.random() * 20),
          overallScore: 50 + Math.random() * 50
        });
      }
    }
    setSafetyData(mockSafetyData);
  }, []);

  const addReport = (report: Omit<SafetyReport, 'id' | 'timestamp'>) => {
    const newReport: SafetyReport = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setReports(prev => [newReport, ...prev]);
  };

  const calculateSafetyScore = (lat: number, lng: number): number => {
    const key = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
    const data = safetyData.get(key);
    
    if (!data) return 50; // Default safety score
    
    // AI-powered safety scoring algorithm
    const weights = {
      crimeRate: 0.3,
      lightingQuality: 0.25,
      policeProximity: 0.2,
      crowdReports: 0.25
    };
    
    const score = (
      (100 - data.crimeRate) * weights.crimeRate +
      data.lightingQuality * weights.lightingQuality +
      data.policeProximity * weights.policeProximity +
      Math.max(0, 100 - data.crowdReports * 5) * weights.crowdReports
    );
    
    return Math.max(0, Math.min(100, score));
  };

  return (
    <SafetyContext.Provider value={{
      reports,
      safetyData,
      addReport,
      calculateSafetyScore
    }}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};