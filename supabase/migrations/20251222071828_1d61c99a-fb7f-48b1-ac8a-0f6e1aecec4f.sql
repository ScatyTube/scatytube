-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Favorites are viewable by everyone" ON public.favorites;

-- Create a new policy that only allows users to view their own favorites
CREATE POLICY "Users can view own favorites" 
ON public.favorites 
FOR SELECT 
USING (auth.uid() = user_id);