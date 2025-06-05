import React from 'react';
import { Heart, Thermometer } from 'lucide-react';

const VitalsTracker = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Vitals Tracker</h2>
        <Heart className="h-6 w-6 text-red-600" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Blood Pressure</p>
            <p className="mt-1 text-sm text-gray-600">120/80 mmHg</p>
          </div>
          <span className="text-green-600 text-sm font-medium">Normal</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Temperature</p>
            <p className="mt-1 text-sm text-gray-600">98.6°F</p>
          </div>
          <Thermometer className="h-5 w-5 text-red-600" />
        </div>
      </div>
    </div>
  );
};

export default VitalsTracker;