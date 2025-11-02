-- Security Fix 1: Implement proper role-based access control
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('customer', 'provider', 'admin', 'superadmin');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only authenticated users can insert their initial role (will be restricted further in app logic)
CREATE POLICY "Users can set initial role on signup"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND role IN ('customer', 'provider'));

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'superadmin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'provider' THEN 3
      WHEN 'customer' THEN 4
    END
  LIMIT 1
$$;

-- Security Fix 2: Restrict profile access to prevent PII exposure
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Security Fix 3: Restrict notification creation to prevent fake notifications
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Only allow backend/server to create notifications (client inserts blocked)
CREATE POLICY "Backend only can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (false);

-- Security Fix 4: Secure storage buckets
-- Make all buckets private
UPDATE storage.buckets 
SET public = false 
WHERE name IN ('job-images', 'service-media', 'review-images');

-- RLS for storage.objects - users can view their own uploads
CREATE POLICY "Users can view own uploads"
ON storage.objects
FOR SELECT
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own uploads
CREATE POLICY "Users can update own uploads"
ON storage.objects
FOR UPDATE
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects
FOR DELETE
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Service providers can view job images for jobs they have access to
-- This will be handled through signed URLs in the application

-- Migrate existing user roles from user_metadata to user_roles table
-- Note: This requires service role access and should be run separately if needed