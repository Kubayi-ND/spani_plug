-- 2025-10-26 10:00:00 UTC
-- Init schema for profiles, provider_profiles, reviews and related tables
-- Also seeds mock data based on src/components/Admin_User/mockdata/mockData.tsx

-- Enable pgcrypto for uuid generation (if available)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- Profiles table (independent primary key so we can seed without auth.users present)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid,
  full_name text,
  email text,
  phone text,
  role text CHECK (role IN ('customer','provider')),
  avatar_url text,
  location text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- Provider-specific table
CREATE TABLE IF NOT EXISTS public.provider_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  skill text,
  rate_per_hour numeric,
  years_experience integer,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews (clients -> profiles, provider -> provider_profiles)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  rating integer,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Provider history
CREATE TABLE IF NOT EXISTS public.provider_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Customer history
CREATE TABLE IF NOT EXISTS public.customer_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Verification documents
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  doc_type text,
  doc_status text,
  created_at timestamptz DEFAULT now()
);

-- Service requests (references profiles directly)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status text CHECK (status IN ('requested','in_progress','completed')) DEFAULT 'requested',
  created_at timestamptz DEFAULT now()
);

-- --------------------
-- Seed mock data
-- --------------------

-- Insert providers into profiles and provider_profiles
-- We'll create deterministic UUIDs so later inserts can reference them

-- Providers (6)
INSERT INTO public.profiles (user_id, full_name, role, avatar_url, location, created_at)
VALUES
  ('a1111111-1111-4111-8111-111111111111', 'Thabo Mthembu', 'provider', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 'Durban Central', now()),
  ('a2222222-2222-4222-8222-222222222222', 'Zanele Khumalo', 'provider', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', 'Umlazi', now()),
  ('a3333333-3333-4333-8333-333333333333', 'Sipho Dlamini', 'provider', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', 'Phoenix', now()),
  ('a4444444-4444-4444-8444-444444444444', 'Nomusa Zulu', 'provider', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', 'Pinetown', now()),
  ('a5555555-5555-4555-8555-555555555555', 'Mandla Ngcobo', 'provider', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', 'Chatsworth', now()),
  ('a6666666-6666-4666-8666-666666666666', 'Precious Mdluli', 'provider', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop', 'Westville', now());

-- Provider profiles
INSERT INTO public.provider_profiles (id, user_id, skill, rate_per_hour, rating, review_count, is_verified)
VALUES
  ('b1111111-1111-4111-8111-111111111111','a1111111-1111-4111-8111-111111111111','plumber',250,4.8,24,true),
  ('b2222222-2222-4222-8222-222222222222','a2222222-2222-4222-8222-222222222222','electrician',300,4.9,38,true),
  ('b3333333-3333-4333-8333-333333333333','a3333333-3333-4333-8333-333333333333','carpenter',200,4.7,19,false),
  ('b4444444-4444-4444-8444-444444444444','a4444444-4444-4444-8444-444444444444','gardener',150,4.6,15,false),
  ('b5555555-5555-4555-8555-555555555555','a5555555-5555-4555-8555-555555555555','painter',180,4.5,22,false),
  ('b6666666-6666-4666-8666-666666666666','a6666666-6666-4666-8666-666666666666','cleaner',120,4.9,42,true);

-- Customers (8)
INSERT INTO public.profiles (user_id, full_name, role, email, phone, avatar_url, location, created_at)
VALUES
  ('c1000000-0000-4000-8000-000000000001','Nkosi Shabalala','customer','nkosi.shabalala@example.com','+27 82 456 7890','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop','Durban, KwaZulu-Natal',now()),
  ('c2000000-0000-4000-8000-000000000002','Thandiwe Mokoena','customer','thandiwe.m@example.com','+27 83 123 4567','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop','Johannesburg, Gauteng',now()),
  ('c3000000-0000-4000-8000-000000000003','Johan van Wyk','customer','johan.vw@example.com','+27 84 987 6543','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop','Cape Town, Western Cape',now()),
  ('c4000000-0000-4000-8000-000000000004','Lerato Mabaso','customer','lerato.mabaso@example.com','+27 82 345 6789','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop','Pretoria, Gauteng',now()),
  ('c5000000-0000-4000-8000-000000000005','Pieter Botha','customer','pieter.b@example.com','+27 83 567 8901','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop','Bloemfontein, Free State',now()),
  ('c6000000-0000-4000-8000-000000000006','Nomvula Dube','customer','nomvula.d@example.com','+27 84 234 5678','https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop','Durban, KwaZulu-Natal',now()),
  ('c7000000-0000-4000-8000-000000000007','Siyabonga Ndlovu','customer','siya.ndlovu@example.com','+27 82 876 5432','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop','Port Elizabeth, Eastern Cape',now()),
  ('c8000000-0000-4000-8000-000000000008','Annemarie Smit','customer','annemarie.s@example.com','+27 83 654 3210','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop','Stellenbosch, Western Cape',now());

-- Insert reviews from mockProviders
INSERT INTO public.reviews (id, provider_id, client_id, rating, comment, created_at)
VALUES
  (gen_random_uuid(), 'b1111111-1111-4111-8111-111111111111', 'c2000000-0000-4000-8000-000000000002', 5, 'Excellent work! Fixed my leaking pipes quickly and professionally.', now()),
  (gen_random_uuid(), 'b1111111-1111-4111-8111-111111111111', 'c3000000-0000-4000-8000-000000000003', 4, 'Very reliable and punctual. Good pricing.', now()),
  (gen_random_uuid(), 'b2222222-2222-4222-8222-222222222222', 'c1000000-0000-4000-8000-000000000001', 5, 'Outstanding service! Very knowledgeable and professional.', now()),
  (gen_random_uuid(), 'b3333333-3333-4333-8333-333333333333', 'c4000000-0000-4000-8000-000000000004', 5, 'Built beautiful custom shelves for my office. Highly recommended!', now()),
  (gen_random_uuid(), 'b4444444-4444-4444-8444-444444444444', 'c5000000-0000-4000-8000-000000000005', 4, 'Great attention to detail. My garden looks amazing!', now()),
  (gen_random_uuid(), 'b5555555-5555-4555-8555-555555555555', 'c6000000-0000-4000-8000-000000000006', 5, 'Very neat and clean work. Finished on time!', now()),
  (gen_random_uuid(), 'b6666666-6666-4666-8666-666666666666', 'c7000000-0000-4000-8000-000000000007', 5, 'Spotless! Best cleaning service I have used.', now());

-- Example provider_history & customer_history entries
INSERT INTO public.provider_history (provider_id, description) VALUES
  ('a1111111-1111-4111-8111-111111111111', 'Completed 50+ residential plumbing jobs'),
  ('a2222222-2222-4222-8222-222222222222', 'Specialist in emergency electrical repairs');

INSERT INTO public.customer_history (customer_id, notes) VALUES
  ('c1000000-0000-4000-8000-000000000001','Booked multiple services — high value'),
  ('c2000000-0000-4000-8000-000000000002','Frequent reviewer');

-- Example verification documents
INSERT INTO public.verification_documents (provider_id, doc_type, doc_status) VALUES
  ('a2222222-2222-4222-8222-222222222222', 'id', 'approved'),
  ('a6666666-6666-4666-8666-666666666666', 'certification', 'pending');

-- Example service requests
INSERT INTO public.service_requests (client_id, provider_id, status) VALUES
  ('c1000000-0000-4000-8000-000000000001', 'a1111111-1111-4111-8111-111111111111', 'completed'),
  ('c3000000-0000-4000-8000-000000000003', 'a2222222-2222-4222-8222-222222222222', 'requested');

COMMIT;

-- End migration
