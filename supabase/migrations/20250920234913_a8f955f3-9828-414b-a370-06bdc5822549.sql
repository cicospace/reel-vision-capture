-- Remove the anonymous read policy that exposes customer video examples to the public
DROP POLICY IF EXISTS "Allow anon read on reel_examples" ON public.reel_examples;

-- Ensure authenticated users can still read reel examples (this policy should already exist)
-- This is just to make sure it exists after removing the anonymous read policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reel_examples' 
    AND policyname = 'Allow authenticated users to read all reel examples'
  ) THEN
    CREATE POLICY "Allow authenticated users to read all reel examples"
    ON public.reel_examples
    FOR SELECT
    USING (auth.role() = 'authenticated');
  END IF;
END $$;