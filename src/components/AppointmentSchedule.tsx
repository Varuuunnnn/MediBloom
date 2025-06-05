import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CalendarX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  scheduled_at: string;
  clinic: {
    name: string;
    address: string;
  } | null;
}

const AppointmentSchedule = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          title,
          scheduled_at,
          clinic:clinics (
            name,
            address
          )
        `)
        .eq('patient_id', user.id)
        .gte('scheduled_at', now)
        .order('scheduled_at')
        .limit(2);

      if (error) throw error;
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

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

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarX className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No upcoming appointments
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Schedule your next appointment to stay on track with your health journey.
          </p>
          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Schedule Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
            >
              <div className="flex-shrink-0">
                <Calendar className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {appointment.title}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1.5" />
                  <span>{format(new Date(appointment.scheduled_at), 'PPp')}</span>
                </div>
                {appointment.clinic && (
                  <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{appointment.clinic.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentSchedule;