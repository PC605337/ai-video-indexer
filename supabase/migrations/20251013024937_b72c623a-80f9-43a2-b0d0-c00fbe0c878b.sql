-- Add video control settings and file path traceability to media_assets
ALTER TABLE public.media_assets
ADD COLUMN IF NOT EXISTS video_id TEXT,
ADD COLUMN IF NOT EXISTS embeddings JSONB,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS indexed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS bounding_box_settings JSONB DEFAULT '{"size": "medium", "color": "#FF0000", "bgTransparency": 0.5, "audioEffects": [], "speakers": []}'::jsonb,
ADD COLUMN IF NOT EXISTS nas_path TEXT,
ADD COLUMN IF NOT EXISTS s3_path TEXT,
ADD COLUMN IF NOT EXISTS proxy_path TEXT,
ADD COLUMN IF NOT EXISTS final_path TEXT,
ADD COLUMN IF NOT EXISTS version_lineage JSONB DEFAULT '[]'::jsonb;

-- Create TTS/STT jobs table
CREATE TABLE IF NOT EXISTS public.tts_stt_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL CHECK (job_type IN ('generate_speech', 'voice_cloning', 'lip_sync', 'transcription')),
  asset_id UUID REFERENCES public.media_assets(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  config JSONB NOT NULL,
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.tts_stt_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for TTS/STT jobs
CREATE POLICY "Anyone can view TTS/STT jobs"
ON public.tts_stt_jobs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create TTS/STT jobs"
ON public.tts_stt_jobs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own TTS/STT jobs"
ON public.tts_stt_jobs FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- Create transcripts table for storing transcriptions with timeline markers
CREATE TABLE IF NOT EXISTS public.transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.media_assets(id) NOT NULL,
  language TEXT NOT NULL,
  dialect TEXT,
  segments JSONB NOT NULL, -- Array of {start, end, text, speaker, confidence}
  speaker_diarization JSONB, -- Speaker identification data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transcripts
CREATE POLICY "Anyone can view transcripts"
ON public.transcripts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can manage transcripts"
ON public.transcripts FOR ALL
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_tts_stt_jobs_updated_at
BEFORE UPDATE ON public.tts_stt_jobs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_transcripts_updated_at
BEFORE UPDATE ON public.transcripts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();