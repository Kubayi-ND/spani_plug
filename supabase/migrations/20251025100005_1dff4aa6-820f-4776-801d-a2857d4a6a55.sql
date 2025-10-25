-- Add foreign key relationships for proper joins

-- Add foreign key from provider_profiles to profiles
ALTER TABLE public.provider_profiles
ADD CONSTRAINT provider_profiles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
ON DELETE CASCADE;

-- Add foreign key from reviews to profiles for client
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_client_id_fkey
FOREIGN KEY (client_id) REFERENCES public.profiles(user_id)
ON DELETE CASCADE;

-- Add foreign key from reviews to profiles for provider  
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_provider_id_fkey
FOREIGN KEY (provider_id) REFERENCES public.profiles(user_id)
ON DELETE CASCADE;