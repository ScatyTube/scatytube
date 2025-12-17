-- Add online status columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN is_online boolean DEFAULT false,
ADD COLUMN last_seen timestamp with time zone DEFAULT now();