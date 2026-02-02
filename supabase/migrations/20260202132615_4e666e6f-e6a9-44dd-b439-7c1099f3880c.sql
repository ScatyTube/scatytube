-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.video_ratings;

-- Create a new policy that restricts SELECT to only the user's own ratings
CREATE POLICY "Users can view own ratings" 
ON public.video_ratings 
FOR SELECT 
USING (auth.uid() = user_id);