-- Update profiles table RLS policy to require authentication
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Ensure posts remain publicly viewable (already public, but confirming)
-- Posts table already has "Anyone can view posts" policy with USING (true)

-- Ensure provider_profiles remain publicly viewable (already public, but confirming)
-- Provider_profiles already has "Anyone can view provider profiles" policy with USING (true)

-- Ensure review_likes SELECT is public but INSERT requires auth (already configured)
-- review_likes already has proper policies

-- Ensure review_comments SELECT is public but INSERT requires auth (already configured)
-- review_comments already has proper policies

-- Update profiles to ensure anonymous users cannot view
-- This ensures only authenticated users can see profile details