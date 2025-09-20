-- Fix RLS bootstrapping issue for user_roles table
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admin users can manage all roles" ON public.user_roles;

-- Create new policy that allows admin management + bootstrapping for the first admin
CREATE POLICY "Admin users can manage all roles with bootstrapping"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  -- Either user is already admin OR no admins exist yet (bootstrapping)
  public.has_role(auth.uid(), 'admin') OR 
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
);