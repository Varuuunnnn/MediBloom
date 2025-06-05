import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose }) => {
  const [recordType, setRecordType] = useState('vitals');
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    temperature: '',
    heartRate: '',
    symptom: '',
    severity: '1',
    notes: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    startDate: '',
  });

  if (!isOpen) return null;

  const handleDateSelect = (selectInfo: any) => {
    setFormData({
      ...formData,
      startDate: format(selectInfo.start, 'yyyy-MM-dd'),
    });
    setShowCalendar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      switch (recordType) {
        case 'vitals':
          await supabase.from('vital_records').insert({
            patient_id: user.id,
            blood_pressure_systolic: parseInt(formData.systolic),
            blood_pressure_diastolic: parseInt(formData.diastolic),
            temperature: parseFloat(formData.temperature),
            heart_rate: parseInt(formData.heartRate),
          });
          break;
          
        case 'symptoms':
          await supabase.from('symptoms').insert({
            patient_id: user.id,
            symptom: formData.symptom,
            severity: parseInt(formData.severity),
            notes: formData.notes,
          });
          break;
          
        case 'medications':
          await supabase.from('medications').insert({
            patient_id: user.id,
            name: formData.medicationName,
            dosage: formData.dosage,
            frequency: formData.frequency,
            start_date: formData.startDate,
          });
          break;
      }
      
      onClose();
      setFormData({
        systolic: '',
        diastolic: '',
        temperature: '',
        heartRate: '',
        symptom: '',
        severity: '1',
        notes: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        startDate: '',
      });
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Health Record</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Record Type</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="vitals">Vitals</option>
            <option value="symptoms">Symptoms</option>
            <option value="medications">Medications</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          {recordType === 'vitals' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Systolic Pressure
                  </label>
                  <input
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diastolic Pressure
                  </label>
                  <input
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          )}

          {recordType === 'symptoms' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symptom
                </label>
                <input
                  type="text"
                  value={formData.symptom}
                  onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Severity (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full"
                  required
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Mild</span>
                  <span>Severe</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
            </div>
          )}

          {recordType === 'medications' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={formData.medicationName}
                  onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.startDate}
                    onClick={() => setShowCalendar(true)}
                    readOnly
                    className="w-full px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                    placeholder="Click to select date"
                    required
                  />
                  {showCalendar && (
                    <div className="absolute z-50 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                      <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                          left: 'prev,next',
                          center: 'title',
                          right: 'today',
                        }}
                        selectable={true}
                        select={handleDateSelect}
                        height="auto"
                        aspectRatio={1.5}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-500"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;