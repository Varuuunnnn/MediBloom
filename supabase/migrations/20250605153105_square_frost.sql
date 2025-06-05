/*
  # Add patient details table

  1. New Tables
    - `patient_details`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients.id)
      - `condition` (text)
      - `height` (numeric)
      - `weight` (numeric)
      - `surgery_date` (date)
      - `allergies` (text)
      - `blood_type` (text)
      - `emergency_contact` (text)
      - `emergency_phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `patient_details` table
    - Add policies for authenticated users to manage their own details
*/

CREATE TABLE IF NOT EXISTS patient_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  condition text,
  height numeric,
  weight numeric,
  surgery_date date,
  allergies text,
  blood_type text,
  emergency_contact text,
  emergency_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(patient_id)
);

ALTER TABLE patient_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own details"
  ON patient_details
  FOR ALL
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);