import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppointmentSchedule = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
        <button 
          onClick={() => navigate('/appointments')}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          View all
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="flex-shrink-0">
            <Calendar className="h-10 w-10 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Follow-up Consultation</h3>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>Tomorrow at 10:00 AM</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>City Hospital, Room 305</span>
            </div>
          </div>
          <button className="ml-4 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Reschedule
          </button>
        </div>

        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex-shrink-0">
            <Calendar className="h-10 w-10 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Blood Test</h3>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>Next Week, Monday at 9:00 AM</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>Medical Laboratory, Floor 2</span>
            </div>
          </div>
          <button className="ml-4 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSchedule;