import React from 'react';
import { AlertCircle } from 'lucide-react';

const SymptomLogger = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Symptom Logger</h2>
        <AlertCircle className="h-6 w-6 text-yellow-600" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Pain Level</p>
            <p className="mt-1 text-sm text-gray-600">Mild - 3/10</p>
          </div>
          <span className="text-yellow-600 text-sm font-medium">Monitor</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Fatigue</p>
            <p className="mt-1 text-sm text-gray-600">Moderate</p>
          </div>
          <span className="text-yellow-600 text-sm font-medium">Monitor</span>
        </div>
      </div>
    </div>
  );
};

export default SymptomLogger;