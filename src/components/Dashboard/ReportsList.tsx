import React from 'react';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyProvider';
import { formatDistance } from 'date-fns';

export const ReportsList: React.FC = () => {
  const { reports } = useSafety();
  const recentReports = reports.slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {recentReports.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No reports available
          </div>
        ) : (
          recentReports.map((report) => (
            <div key={report.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {report.type.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistance(report.timestamp, new Date(), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{report.location[0].toFixed(4)}, {report.location[1].toFixed(4)}</span>
                    </div>
                  </div>
                </div>
                {report.verified && (
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};