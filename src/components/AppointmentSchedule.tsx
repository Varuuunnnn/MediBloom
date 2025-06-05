import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const AppointmentSchedule = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
          <div className="flex-shrink-0">
            <Calendar className="h-10 w-10 text-blue-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-900">Follow-up Consultation</h3>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>Tomorrow at 10:00 AM</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>City Hospital, Room 305</span>
            </div>
          </div>
          <button className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            Reschedule
          </button>
        </div>

        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <Calendar className="h-10 w-10 text-gray-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-900">Blood Test</h3>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>Next Week, Monday at 9:00 AM</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>Medical Laboratory, Floor 2</span>
            </div>
          </div>
          <button className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSchedule;