-- Assign admin role to existing admin user
-- This ensures the admin@cicospace.com user has admin access
INSERT INTO public.user_roles (user_id, role) 
VALUES ('656345dc-ff99-41af-8a51-63e0fd763d7d'::uuid, 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;