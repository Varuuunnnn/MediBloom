import React from 'react';
import { Pill, Clock } from 'lucide-react';

const MedicationReminder = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Medication Reminder</h2>
        <Pill className="h-6 w-6 text-blue-600" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Tacrolimus</p>
            <p className="mt-1 text-sm text-gray-600">2mg - Twice daily</p>
          </div>
          <div className="flex items-center text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Prednisone</p>
            <p className="mt-1 text-sm text-gray-600">5mg - Once daily</p>
          </div>
          <div className="flex items-center text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationReminder;