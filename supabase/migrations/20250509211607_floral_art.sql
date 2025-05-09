/*
  # Initial database setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `updated_at` (timestamptz)
      - `username` (text)
      - `full_name` (text)
      - `role` (text, either 'admin' or 'user')
    - `items`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `person_name` (text)
      - `description` (text)
      - `category` (text, one of 'urgent', 'medium', 'small')
      - `resolved` (boolean)
      - `resolved_at` (timestamptz, nullable)
      - `created_by` (uuid, references auth.users.id)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add specific policies for admin users
  3. Functions and Triggers
    - Create function to manage auto removal of resolved items after 1 week
    - Add trigger to automatically create a profile for new users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  username TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'))
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  person_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('urgent', 'medium', 'small')),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create trigger function to create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, updated_at, username, full_name, role)
  VALUES (
    NEW.id,
    now(),
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to automatically delete resolved items older than 1 week
CREATE OR REPLACE FUNCTION public.delete_old_resolved_items()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.items
  WHERE resolved = true
  AND resolved_at < (now() - INTERVAL '7 days');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically delete old resolved items
CREATE OR REPLACE TRIGGER on_resolved_items_cleanup
  AFTER INSERT OR UPDATE ON public.items
  FOR EACH STATEMENT EXECUTE FUNCTION public.delete_old_resolved_items();

-- Create policies for profiles
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for items
-- Any authenticated user can create items
CREATE POLICY "Authenticated users can create items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Any authenticated user can read all items
CREATE POLICY "Authenticated users can read all items"
  ON items
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own items
CREATE POLICY "Users can update own items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin policy for updating any item
CREATE POLICY "Admins can update any item"
  ON items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );