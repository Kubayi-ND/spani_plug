-- Create customer_history table
CREATE TABLE public.customer_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_provider_name TEXT NOT NULL,
  service_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider_history table
CREATE TABLE public.provider_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_jobs INTEGER NOT NULL DEFAULT 0,
  pending_jobs INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verification_documents table
CREATE TABLE public.verification_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certified_id TEXT NOT NULL,
  document_url TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id)
);

-- Create posts table for media content
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  dislikes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.customer_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_history
CREATE POLICY "Users can view their own customer history"
  ON public.customer_history FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own customer history"
  ON public.customer_history FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own customer history"
  ON public.customer_history FOR UPDATE
  USING (auth.uid() = customer_id);

-- RLS Policies for provider_history
CREATE POLICY "Providers can view their own history"
  ON public.provider_history FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can insert their own history"
  ON public.provider_history FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own history"
  ON public.provider_history FOR UPDATE
  USING (auth.uid() = provider_id);

-- RLS Policies for verification_documents
CREATE POLICY "Providers can view their own verification docs"
  ON public.verification_documents FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can insert their own verification docs"
  ON public.verification_documents FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own verification docs"
  ON public.verification_documents FOR UPDATE
  USING (auth.uid() = provider_id);

-- RLS Policies for posts
CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_provider_history_updated_at
  BEFORE UPDATE ON public.provider_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_customer_history_customer_id ON public.customer_history(customer_id);
CREATE INDEX idx_customer_history_service_date ON public.customer_history(service_date);
CREATE INDEX idx_provider_history_provider_id ON public.provider_history(provider_id);
CREATE INDEX idx_verification_documents_provider_id ON public.verification_documents(provider_id);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);