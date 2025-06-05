/*
  # Add clinics and update appointments table

  1. New Tables
    - `clinics`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `phone` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add `clinic_id` to appointments table
    - Add foreign key constraint to link appointments with clinics

  3. Security
    - Enable RLS on clinics table
    - Add policies for authenticated users to view clinics
*/

CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS clinic_id uuid REFERENCES clinics(id);

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clinics"
  ON clinics
  FOR SELECT
  TO authenticated
  USING (true);

-- Add some sample clinics
INSERT INTO clinics (name, address, phone) VALUES
  ('City General Hospital', '123 Medical Center Blvd, City, State 12345', '(555) 123-4567'),
  ('Downtown Medical Center', '456 Healthcare Ave, City, State 12345', '(555) 234-5678'),
  ('Riverside Clinic', '789 Wellness Way, City, State 12345', '(555) 345-6789');