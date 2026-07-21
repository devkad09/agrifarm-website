-- Create SMS Alerts Table
CREATE TABLE IF NOT EXISTS public.sms_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  phone_number text NOT NULL,
  crop text NOT NULL,
  market text NOT NULL,
  target_price numeric,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_alerts TO authenticated, anon;
GRANT ALL ON public.sms_alerts TO service_role;

-- Enable Row Level Security
ALTER TABLE public.sms_alerts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can subscribe to SMS alerts"
  ON public.sms_alerts FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Users can view own SMS alerts"
  ON public.sms_alerts FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can delete own SMS alerts"
  ON public.sms_alerts FOR DELETE TO anon, authenticated USING (true);
