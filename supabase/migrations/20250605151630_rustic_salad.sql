/*
  # Health Tracking System Schema

  1. New Tables
    - patients
      - Basic patient information and authentication
    - vital_records
      - Blood pressure, temperature, and other vital measurements
    - medications
      - Medication details and schedules
    - symptoms
      - Symptom logging and tracking
    - appointments
      - Medical appointment scheduling

  2. Security
    - Enable RLS on all tables
    - Policies to ensure patients can only access their own data
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create vital_records table
CREATE TABLE IF NOT EXISTS vital_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  blood_pressure_systolic integer NOT NULL,
  blood_pressure_diastolic integer NOT NULL,
  temperature decimal(4,1) NOT NULL,
  heart_rate integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE vital_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own vital records"
  ON vital_records FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own medications"
  ON medications FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  symptom text NOT NULL,
  severity integer NOT NULL CHECK (severity BETWEEN 1 AND 10),
  notes text,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own symptoms"
  ON symptoms FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  location text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id);