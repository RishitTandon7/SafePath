import React, { useState } from 'react';
import { X, Camera, MapPin, AlertTriangle } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyProvider';
import { useLocation } from '../../contexts/LocationContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const { addReport } = useSafety();
  const { currentLocation } = useLocation();
  const [reportType, setReportType] = useState<'harassment' | 'poor-lighting' | 'crime' | 'unsafe-area' | 'other'>('harassment');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentLocation) {
      alert('Location not available. Please enable location services.');
      return;
    }

    addReport({
      type: reportType,
      location: currentLocation,
      description,
      verified: false,
      severity
    });

    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Report Safety Issue</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="harassment">Harassment</option>
              <option value="poor-lighting">Poor Lighting</option>
              <option value="crime">Crime Activity</option>
              <option value="unsafe-area">Unsafe Area</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level
            </label>
            <div className="flex space-x-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    value={level}
                    checked={severity === level}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className={`text-sm capitalize ${
                    level === 'high' ? 'text-red-600' :
                    level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened or what makes this area unsafe..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {currentLocation 
                ? `Location: ${currentLocation[0].toFixed(4)}, ${currentLocation[1].toFixed(4)}`
                : 'Location not available'
              }
            </span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Anonymous Reporting</p>
                <p>Your report is completely anonymous and helps keep the community safe.</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};