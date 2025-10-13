-- Create review_comments table for timeframe-based feedback (Frame.io style)
CREATE TABLE IF NOT EXISTS public.review_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    comment TEXT NOT NULL,
    timeframe_start DOUBLE PRECISION, -- in seconds for videos
    timeframe_end DOUBLE PRECISION, -- in seconds for videos
    position_x DOUBLE PRECISION, -- for images (percentage)
    position_y DOUBLE PRECISION, -- for images (percentage)
    status TEXT DEFAULT 'open', -- open, resolved, approved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID
);

-- Enable RLS
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review_comments
CREATE POLICY "Anyone can view comments"
ON public.review_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.review_comments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
ON public.review_comments
FOR UPDATE
USING (true);

-- Create asset_edit_sessions table for tracking editing sessions
CREATE TABLE IF NOT EXISTS public.asset_edit_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE NOT NULL,
    editor_id UUID NOT NULL,
    software TEXT, -- premiere_pro, final_cut, photoshop, etc.
    status TEXT DEFAULT 'in_progress', -- in_progress, completed, cancelled
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    closed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Enable RLS
ALTER TABLE public.asset_edit_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for asset_edit_sessions
CREATE POLICY "Anyone can view edit sessions"
ON public.asset_edit_sessions
FOR SELECT
USING (true);

CREATE POLICY "Editors can manage sessions"
ON public.asset_edit_sessions
FOR ALL
USING (true);

-- Update viewer_requests to handle all assets (not just code_red)
ALTER TABLE public.viewer_requests
ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'view'; -- view, download, edit

-- Create trigger for updating updated_at on review_comments
DROP TRIGGER IF EXISTS update_review_comments_updated_at ON public.review_comments;
CREATE TRIGGER update_review_comments_updated_at
BEFORE UPDATE ON public.review_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();