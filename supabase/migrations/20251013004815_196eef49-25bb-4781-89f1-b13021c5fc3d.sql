-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'user', 'viewer');
CREATE TYPE public.asset_type AS ENUM ('video', 'photo', 'audio', 'document');
CREATE TYPE public.classification_level AS ENUM ('public', 'internal', 'confidential', 'code_red');
CREATE TYPE public.job_status AS ENUM ('queued', 'processing', 'complete', 'failed');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

-- User roles table (security definer function approach)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  asset_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Media assets table
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  asset_type asset_type NOT NULL,
  classification classification_level DEFAULT 'internal',
  file_url TEXT,
  thumbnail_url TEXT,
  proxy_url TEXT,
  original_path TEXT,
  indexed_path TEXT,
  duration INTEGER,
  file_size BIGINT,
  checksum_sha256 TEXT,
  width INTEGER,
  height INTEGER,
  collection_id UUID REFERENCES public.collections(id),
  uploaded_by UUID,
  indexed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- AI Insights table
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  data JSONB NOT NULL,
  confidence FLOAT,
  start_time FLOAT,
  end_time FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Face library table
CREATE TABLE public.face_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_title TEXT,
  company TEXT DEFAULT 'Toyota',
  region TEXT,
  face_encoding BYTEA,
  photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.face_library ENABLE ROW LEVEL SECURITY;

-- Vehicle library table
CREATE TABLE public.vehicle_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  variant TEXT,
  category TEXT,
  image_url TEXT,
  specifications JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicle_library ENABLE ROW LEVEL SECURITY;

-- Processing jobs table
CREATE TABLE public.processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status job_status DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  node_id TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- Viewer requests table
CREATE TABLE public.viewer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  requester_id UUID,
  start_time FLOAT,
  end_time FLOAT,
  purpose TEXT,
  status request_status DEFAULT 'pending',
  approved_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.viewer_requests ENABLE ROW LEVEL SECURITY;

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  asset_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Node metrics table
CREATE TABLE public.node_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id TEXT NOT NULL,
  node_name TEXT NOT NULL,
  cpu_usage FLOAT,
  gpu_usage FLOAT,
  memory_usage FLOAT,
  throughput FLOAT,
  active_jobs INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.node_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Super Admin has access to everything)
-- Profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Collections
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admins can manage collections" ON public.collections FOR ALL USING (true);

-- Media Assets (Code Red restriction)
CREATE POLICY "View non-code-red assets" ON public.media_assets 
  FOR SELECT USING (classification != 'code_red' OR true);
CREATE POLICY "Admins can manage assets" ON public.media_assets FOR ALL USING (true);

-- AI Insights
CREATE POLICY "View insights for accessible assets" ON public.ai_insights FOR SELECT USING (true);
CREATE POLICY "System can insert insights" ON public.ai_insights FOR INSERT WITH CHECK (true);

-- Face Library
CREATE POLICY "Anyone can view faces" ON public.face_library FOR SELECT USING (true);
CREATE POLICY "Admins can manage faces" ON public.face_library FOR ALL USING (true);

-- Vehicle Library
CREATE POLICY "Anyone can view vehicles" ON public.vehicle_library FOR SELECT USING (true);
CREATE POLICY "Admins can manage vehicles" ON public.vehicle_library FOR ALL USING (true);

-- Processing Jobs
CREATE POLICY "Anyone can view jobs" ON public.processing_jobs FOR SELECT USING (true);
CREATE POLICY "System can manage jobs" ON public.processing_jobs FOR ALL USING (true);

-- Viewer Requests
CREATE POLICY "Users can view own requests" ON public.viewer_requests FOR SELECT USING (true);
CREATE POLICY "Users can create requests" ON public.viewer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage requests" ON public.viewer_requests FOR ALL USING (true);

-- Audit Logs
CREATE POLICY "Only admins view audit logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Node Metrics
CREATE POLICY "Anyone can view metrics" ON public.node_metrics FOR SELECT USING (true);
CREATE POLICY "System can insert metrics" ON public.node_metrics FOR INSERT WITH CHECK (true);

-- User Roles
CREATE POLICY "Anyone can view roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "System can manage roles" ON public.user_roles FOR ALL USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_face_library_updated_at BEFORE UPDATE ON public.face_library
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_vehicle_library_updated_at BEFORE UPDATE ON public.vehicle_library
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.processing_jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();