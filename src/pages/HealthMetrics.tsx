import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, Heart, Thermometer, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

const HealthMetrics = () => {
  const [vitalsData, setVitalsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVitalsData();
  }, []);

  const fetchVitalsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('vital_records')
        .select('*')
        .eq('patient_id', user.id)
        .order('recorded_at', { ascending: true });

      if (error) throw error;

      const formattedData = data.map(record => ({
        ...record,
        date: format(new Date(record.recorded_at), 'MMM dd'),
        systolic: record.blood_pressure_systolic,
        diastolic: record.blood_pressure_diastolic,
      }));

      setVitalsData(formattedData);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current: number, target: number, min: number) => {
    return ((current - min) / (target - min)) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const latestVitals = vitalsData[vitalsData.length - 1] || {};

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Health Metrics</h1>
        <Activity className="h-8 w-8 text-primary-600 dark:text-primary-400" />
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Heart Rate</span>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {latestVitals.heart_rate || '--'}
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">bpm</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-4 text-xs flex rounded bg-red-200 dark:bg-red-900">
              <div
                style={{ width: `${calculateProgress(latestVitals.heart_rate || 0, 100, 60)}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Pressure</span>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {latestVitals.systolic || '--'}/{latestVitals.diastolic || '--'}
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">mmHg</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
              <div
                style={{ width: `${calculateProgress(latestVitals.systolic || 0, 140, 90)}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</span>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {latestVitals.temperature || '--'}
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">°F</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-4 text-xs flex rounded bg-yellow-200 dark:bg-yellow-900">
              <div
                style={{ width: `${calculateProgress(latestVitals.temperature || 0, 99, 97)}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Blood Pressure Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={{ fill: '#60A5FA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Heart Rate History</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="heart_rate"
                  stroke="#EF4444"
                  fill="#FEE2E2"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;