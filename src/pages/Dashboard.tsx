import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import MedicationReminder from '../components/MedicationReminder';
import VitalsTracker from '../components/VitalsTracker';
import SymptomLogger from '../components/SymptomLogger';
import HealthSummary from '../components/HealthSummary';
import AppointmentSchedule from '../components/AppointmentSchedule';
import AddRecordModal from '../components/AddRecordModal';
import { exportHealthReport } from '../utils/exportUtils';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExport = async () => {
    try {
      // Fetch patient data
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .single();

      if (patientError) throw patientError;

      // Fetch vitals
      const { data: vitals, error: vitalsError } = await supabase
        .from('vital_records')
        .select('*')
        .order('recorded_at', { ascending: false });

      if (vitalsError) throw vitalsError;

      // Fetch medications
      const { data: medications, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .order('start_date', { ascending: false });

      if (medsError) throw medsError;

      // Export the report
      exportHealthReport({
        ...patientData,
        vitals,
        medications
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      // Here you would typically show an error notification
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Health Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FileDown className="h-5 w-5 mr-2" />
            Export Report
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Record
          </button>
        </div>
      </div>
      
      <HealthSummary />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MedicationReminder />
        <VitalsTracker />
        <SymptomLogger />
      </div>
      
      <AppointmentSchedule />

      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;