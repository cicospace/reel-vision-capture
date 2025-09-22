-- Fix security issues with reel_examples table
-- Drop the overly permissive policy that allows authenticated users to read all reel examples
DROP POLICY IF EXISTS "Allow authenticated users to read all reel examples" ON public.reel_examples;

-- Add admin-only SELECT policy for reel_examples
CREATE POLICY "Admin users can read all reel examples"
ON public.reel_examples
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin UPDATE and DELETE policies for reel_examples
CREATE POLICY "Admin users can update reel examples"
ON public.reel_examples
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin users can delete reel examples"
ON public.reel_examples
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Clean up redundant INSERT policies on submissions table
-- Keep the necessary ones and remove duplicates
DROP POLICY IF EXISTS "Allow anon insert on submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow authenticated insert on submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON public.submissions;

-- Create a single comprehensive INSERT policy for submissions
CREATE POLICY "Allow public submissions"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Clean up redundant INSERT policies on reel_examples table
DROP POLICY IF EXISTS "Allow authenticated users to insert reel examples" ON public.reel_examples;
DROP POLICY IF EXISTS "Allow public inserts for reel examples" ON public.reel_examples;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.reel_examples;
DROP POLICY IF EXISTS "Allow anon insert on reel_examples" ON public.reel_examples;
DROP POLICY IF EXISTS "Allow authenticated insert on reel_examples" ON public.reel_examples;

-- Create a single comprehensive INSERT policy for reel_examples
CREATE POLICY "Allow public reel example submissions"
ON public.reel_examples
FOR INSERT
WITH CHECK (true);