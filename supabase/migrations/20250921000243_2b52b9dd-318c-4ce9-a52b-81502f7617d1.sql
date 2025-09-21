-- Secure submission_files table - restrict to admin access only
DROP POLICY IF EXISTS "Allow authenticated users to read all submission files" ON public.submission_files;

CREATE POLICY "Admin users can read all submission files"
ON public.submission_files
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin users can update submission files"
ON public.submission_files
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin users can delete submission files"
ON public.submission_files
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Secure submission_notes table - restrict to admin access only
DROP POLICY IF EXISTS "Allow authenticated users to read all submission notes" ON public.submission_notes;

CREATE POLICY "Admin users can read all submission notes"
ON public.submission_notes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin users can update submission notes"
ON public.submission_notes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin users can delete submission notes"
ON public.submission_notes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));