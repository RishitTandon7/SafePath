import React from 'react';
import { Shield, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyProvider';

export const StatsOverview: React.FC = () => {
  const { reports } = useSafety();

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: 'High Priority',
      value: reports.filter(r => r.severity === 'high').length,
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Active Users',
      value: '1,247',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Safety Improvement',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};