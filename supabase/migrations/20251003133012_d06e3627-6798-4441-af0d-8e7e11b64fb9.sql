-- Grant INSERT permission to anon role for anonymous form submissions
GRANT INSERT ON public.submissions TO anon;
GRANT INSERT ON public.reel_examples TO anon;

-- Grant INSERT permission to authenticated role for file uploads and notes
GRANT INSERT ON public.submission_files TO authenticated;
GRANT INSERT ON public.submission_notes TO authenticated;

-- Grant full access to authenticated role (admins use this with RLS policies)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reel_examples TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_files TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;