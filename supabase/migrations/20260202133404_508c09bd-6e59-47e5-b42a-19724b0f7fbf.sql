-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Subscriptions are viewable by everyone" ON public.subscriptions;

-- Create a new policy that restricts SELECT to users who are either the subscriber or the channel owner
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = subscriber_id OR auth.uid() = channel_id);