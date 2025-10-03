-- Force PostgREST to reload its schema cache to recognize the new GRANT permissions
NOTIFY pgrst, 'reload schema';