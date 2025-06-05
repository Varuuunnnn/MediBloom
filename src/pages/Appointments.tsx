import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MapPin, Phone, Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DatePicker from 'react-datepicker';

interface Appointment {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  location: string;
  clinic_id: string;
  clinic: {
    name: string;
    address: string;
    phone: string;
  } | null;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clinic_id: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchClinics();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clinic:clinics (
            name,
            address,
            phone
          )
        `)
        .eq('patient_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) throw error;
      setClinics(data);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setSelectedDate(new Date(appointment.scheduled_at));
    setFormData({
      title: appointment.title,
      description: appointment.description || '',
      clinic_id: appointment.clinic_id,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const selectedClinic = clinics.find(clinic => clinic.id === formData.clinic_id);
      if (!selectedClinic) {
        throw new Error('Selected clinic not found');
      }

      if (!selectedDate) {
        throw new Error('Please select a date and time');
      }

      if (editingAppointment) {
        const { error } = await supabase
          .from('appointments')
          .update({
            ...formData,
            scheduled_at: selectedDate.toISOString(),
            location: selectedClinic.address,
          })
          .eq('id', editingAppointment.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('appointments')
          .insert({
            patient_id: user.id,
            scheduled_at: selectedDate.toISOString(),
            location: selectedClinic.address,
            ...formData,
          });

        if (error) throw error;
      }

      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        clinic_id: '',
      });
      setSelectedDate(null);
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData({
      title: '',
      description: '',
      clinic_id: '',
    });
    setSelectedDate(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Appointments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Appointment
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No appointments scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{appointment.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(appointment.scheduled_at), 'PPp')}
                  </p>
                  {appointment.clinic && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        {appointment.clinic.address}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        {appointment.clinic.phone}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(appointment)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clinic
                </label>
                <select
                  value={formData.clinic_id}
                  onChange={(e) => setFormData({ ...formData, clinic_id: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date & Time
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholderText="Select date and time"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;