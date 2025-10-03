-- Block anonymous users from SELECT on submissions
CREATE POLICY "Block anonymous SELECT on submissions"
ON public.submissions
FOR SELECT
TO anon
USING (false);

-- Block anonymous users from SELECT on reel_examples  
CREATE POLICY "Block anonymous SELECT on reel_examples"
ON public.reel_examples
FOR SELECT
TO anon
USING (false);

-- Block anonymous users from SELECT on submission_files
CREATE POLICY "Block anonymous SELECT on submission_files"
ON public.submission_files
FOR SELECT
TO anon
USING (false);

-- Block anonymous users from SELECT on submission_notes
CREATE POLICY "Block anonymous SELECT on submission_notes"
ON public.submission_notes
FOR SELECT
TO anon
USING (false);