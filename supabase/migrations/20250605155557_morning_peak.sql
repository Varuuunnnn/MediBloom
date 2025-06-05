/*
  # Add missing columns to patient_details table

  1. Changes
    - Add missing columns to patient_details table:
      - condition (text)
      - height (numeric)
      - weight (numeric)
      - surgery_date (date)
      - allergies (text)
      - blood_type (text)
      - emergency_contact (text)
      - emergency_phone (text)

  2. Security
    - No changes to RLS policies needed as the existing policies cover the new columns
*/

DO $$ 
BEGIN
  -- Add condition column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'condition'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN condition text;
  END IF;

  -- Add height column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'height'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN height numeric;
  END IF;

  -- Add weight column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'weight'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN weight numeric;
  END IF;

  -- Add surgery_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'surgery_date'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN surgery_date date;
  END IF;

  -- Add allergies column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'allergies'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN allergies text;
  END IF;

  -- Add blood_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'blood_type'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN blood_type text;
  END IF;

  -- Add emergency_contact column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'emergency_contact'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN emergency_contact text;
  END IF;

  -- Add emergency_phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patient_details' AND column_name = 'emergency_phone'
  ) THEN
    ALTER TABLE patient_details ADD COLUMN emergency_phone text;
  END IF;
END $$;