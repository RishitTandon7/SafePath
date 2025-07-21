import React from 'react';
import { useMap } from 'react-leaflet';
import { useSafety } from '../../contexts/SafetyProvider';
import L from 'leaflet';

export const SafetyHeatmap: React.FC = () => {
  const map = useMap();
  const { calculateSafetyScore } = useSafety();

  React.useEffect(() => {
    const bounds = map.getBounds();
    const heatmapData: Array<[number, number, number]> = [];

    // Generate heatmap points based on current map bounds
    const latStep = (bounds.getNorth() - bounds.getSouth()) / 20;
    const lngStep = (bounds.getEast() - bounds.getWest()) / 20;

    for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += latStep) {
      for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += lngStep) {
        const safetyScore = calculateSafetyScore(lat, lng);
        const intensity = Math.max(0, (100 - safetyScore) / 100); // Invert score for danger intensity
        
        if (intensity > 0.3) { // Only show areas with notable danger
          heatmapData.push([lat, lng, intensity]);
        }
      }
    }

    // Create heatmap circles (simplified version of heatmap)
    const circles: L.CircleMarker[] = [];
    
    heatmapData.forEach(([lat, lng, intensity]) => {
      const circle = L.circleMarker([lat, lng], {
        radius: 50,
        fillColor: intensity > 0.7 ? '#EF4444' : intensity > 0.5 ? '#F59E0B' : '#FED7AA',
        color: 'transparent',
        fillOpacity: 0.3,
        weight: 0
      }).addTo(map);
      
      circles.push(circle);
    });

    return () => {
      circles.forEach(circle => map.removeLayer(circle));
    };
  }, [map, calculateSafetyScore]);

  return null;
};