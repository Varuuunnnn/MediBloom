import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose }) => {
  const [recordType, setRecordType] = useState('vitals');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get the current user's ID
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
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Health Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Systolic Pressure
                  </label>
                  <input
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diastolic Pressure
                  </label>
                  <input
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          )}

          {recordType === 'symptoms' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptom
                </label>
                <input
                  type="text"
                  value={formData.symptom}
                  onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Mild</span>
                  <span>Severe</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={3}
                />
              </div>
            </div>
          )}

          {recordType === 'medications' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={formData.medicationName}
                  onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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