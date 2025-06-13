
-- Create a table to track revision requirements
CREATE TABLE public.revision_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  module_id INTEGER NOT NULL,
  test_id INTEGER NOT NULL,
  failed_score NUMERIC NOT NULL,
  required_passing_score NUMERIC NOT NULL,
  revision_completed BOOLEAN DEFAULT FALSE,
  revision_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.revision_requirements ENABLE ROW LEVEL SECURITY;

-- Users can view their own revision requirements
CREATE POLICY "Users can view their own revision requirements" 
  ON public.revision_requirements 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own revision requirements
CREATE POLICY "Users can update their own revision requirements" 
  ON public.revision_requirements 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- System can insert revision requirements
CREATE POLICY "System can create revision requirements" 
  ON public.revision_requirements 
  FOR INSERT 
  WITH CHECK (true);

-- Create a trigger to automatically create revision requirements when a test is failed
CREATE OR REPLACE FUNCTION handle_test_failure()
RETURNS TRIGGER AS $$
BEGIN
  -- If the test was failed (score below passing score), create a revision requirement
  IF NOT NEW.passed THEN
    INSERT INTO public.revision_requirements (
      user_id, 
      module_id, 
      test_id, 
      failed_score, 
      required_passing_score
    ) VALUES (
      NEW.user_id,
      NEW.module_id,
      NEW.test_id,
      NEW.score,
      70.0 -- Default passing score, could be made dynamic based on test
    )
    ON CONFLICT DO NOTHING; -- Avoid duplicates if user retakes and fails again
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_test_result_insert
  AFTER INSERT ON public.test_results
  FOR EACH ROW
  EXECUTE FUNCTION handle_test_failure();
