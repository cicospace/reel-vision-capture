-- Grant permissions to authenticator role (required for PostgREST to function)
GRANT INSERT, SELECT, UPDATE, DELETE ON public.submissions TO authenticator;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.reel_examples TO authenticator;
GRANT ALL ON public.submission_files TO authenticator;
GRANT ALL ON public.submission_notes TO authenticator;
GRANT ALL ON public.user_roles TO authenticator;

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';