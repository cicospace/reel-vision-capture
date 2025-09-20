-- Fix security issue: Remove anonymous read access to submissions table
-- This prevents unauthorized access to confidential business information

-- Drop policies that allow anonymous users to read submissions data
DROP POLICY IF EXISTS "Allow anon read on submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow anon read" ON public.submissions;

-- Drop duplicate/redundant policies to clean up
DROP POLICY IF EXISTS "Allow anon insert" ON public.submissions;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.submissions;
DROP POLICY IF EXISTS "Restrict reading submissions to authenticated users" ON public.submissions;

-- Ensure we have clean, secure policies
-- Keep anonymous INSERT access for form submissions (business requirement)
CREATE POLICY "Allow anonymous form submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Ensure authenticated users have full access for admin functionality
CREATE POLICY "Allow authenticated users full access" 
ON public.submissions 
FOR ALL 
USING (auth.role() = 'authenticated');