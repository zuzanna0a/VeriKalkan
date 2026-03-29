-- Create breach_cache table
CREATE TABLE IF NOT EXISTS breach_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  result jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_breach_cache_email ON breach_cache(email);

-- Optional: Enable RLS if needed, but for MVP it's often off
-- ALTER TABLE breach_cache ENABLE ROW LEVEL SECURITY;
