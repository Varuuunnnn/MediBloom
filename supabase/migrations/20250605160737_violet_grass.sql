/*
  # Fix patients table RLS policies

  1. Changes
    - Add RLS policy to allow new users to insert their own patient record
    - Keep existing policies for SELECT and UPDATE

  2. Security
    - Ensures users can only create their own patient record
    - Maintains existing row-level security
*/

-- Add policy to allow users to insert their own patient record
CREATE POLICY "Users can create own patient record"
ON patients
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);