-- Assign admin role to current authenticated user
-- This ensures the admin@example.com user (f005e5ee-1bad-4cfe-a939-d2e0d22034b6) has admin access
INSERT INTO public.user_roles (user_id, role) 
VALUES ('f005e5ee-1bad-4cfe-a939-d2e0d22034b6'::uuid, 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;