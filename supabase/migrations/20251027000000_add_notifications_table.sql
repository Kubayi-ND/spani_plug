-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    related_id UUID,
    related_type TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications

-- Allow users to view their own notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO public
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Allow authenticated users to create notifications
CREATE POLICY "Users can create notifications"
    ON public.notifications FOR INSERT
    TO public
    WITH CHECK (auth.role() = 'authenticated');  -- Allow any authenticated user to create notifications

-- Allow users to update their own notifications (e.g., marking as read)
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    TO public
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();