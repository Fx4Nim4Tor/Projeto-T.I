/*
  # Add predefined users

  1. New Users
    - Admin user with admin role
    - Regular user with user role
  2. Security
    - Create users with secure password hashes
    - Set up profiles with correct roles
*/

-- Create admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
)
VALUES (
  gen_random_uuid(),
  'admin',
  crypt('admin', gen_salt('bf')),
  now(),
  '{"role": "admin"}'::jsonb
);

-- Create regular user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
)
VALUES (
  gen_random_uuid(),
  'user',
  crypt('user', gen_salt('bf')),
  now(),
  '{"role": "user"}'::jsonb
);