import React from 'react';
import { TrendingUp, Activity, Heart } from 'lucide-react';

const HealthSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card">
        <div className="flex items-center">
          <div className="icon-success">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Recovery Progress</h2>
            <p className="mt-1 text-2xl font-semibold text-gray-900">85%</p>
            <p className="mt-1 text-sm text-success-600">↑ 12% from last week</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="icon-primary">
            <Activity className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Daily Activities</h2>
            <p className="mt-1 text-2xl font-semibold text-gray-900">6/8</p>
            <p className="mt-1 text-sm text-primary-600">Tasks completed</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="icon-danger">
            <Heart className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Overall Health</h2>
            <p className="mt-1 text-2xl font-semibold text-gray-900">Good</p>
            <p className="mt-1 text-sm text-danger-600">All vitals normal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSummary;