-- Run this in your Supabase SQL Editor

-- 1. Create the user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    sf_username TEXT,
    sf_password TEXT,
    sf_security_token TEXT,
    sf_domain TEXT DEFAULT 'login',
    is_connected BOOLEAN DEFAULT FALSE,
    org_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable RLS for this table (Dev Mode)
-- This allows the Backend (which uses the Anon Key) to read/write without complex policies.
-- In production, you would use the SERVICE_ROLE_KEY in the backend.
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;

-- 3. (Optional) Grant access to anon/authenticated roles just in case
GRANT ALL ON public.user_settings TO postgres;
GRANT ALL ON public.user_settings TO anon;
GRANT ALL ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
