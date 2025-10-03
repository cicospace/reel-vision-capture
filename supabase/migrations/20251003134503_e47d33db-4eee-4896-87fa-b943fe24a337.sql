-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Allow anonymous submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow anonymous reel example submissions" ON public.reel_examples;

-- Recreate INSERT policies as explicitly PERMISSIVE
CREATE POLICY "Allow anonymous submissions"
ON public.submissions
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous reel example submissions"
ON public.reel_examples
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';