import React from 'react';
import { BarChart3, Calendar, Filter } from 'lucide-react';

export const TrendAnalysis: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', reports: 12, safety: 78 },
    { day: 'Tue', reports: 8, safety: 82 },
    { day: 'Wed', reports: 15, safety: 75 },
    { day: 'Thu', reports: 6, safety: 85 },
    { day: 'Fri', reports: 18, safety: 72 },
    { day: 'Sat', reports: 22, safety: 68 },
    { day: 'Sun', reports: 14, safety: 80 }
  ];

  const maxReports = Math.max(...weeklyData.map(d => d.reports));

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Safety Trends</h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
              <Calendar className="w-4 h-4" />
              <span>Last 7 days</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {weeklyData.map((data) => (
            <div key={data.day} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-700">
                {data.day}
              </div>
              <div className="flex-1 flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Reports</span>
                    <span>{data.reports}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.reports / maxReports) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Safety Score</span>
                    <span>{data.safety}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.safety}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Insights</h3>
              <p className="text-sm text-blue-800 mt-1">
                Safety scores are trending upward this week. Weekend reports typically increase due to higher foot traffic.
                Consider deploying additional volunteer patrols in high-risk areas during Friday-Sunday.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};