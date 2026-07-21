
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'officer', 'farmer');

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  region text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone signed in"
  ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Security definer role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Trigger: on new user, create profile + assign role (first user = admin, else farmer)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  assigned_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, region)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'region', '')
  );

  SELECT count(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'farmer';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT ON public.blog_posts TO anon;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON public.blog_posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can read all posts"
  ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert posts"
  ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX blog_posts_published_at_idx ON public.blog_posts (published_at DESC) WHERE published = true;

-- Seed a few realistic AgriFarm news posts (no author, system-authored)
INSERT INTO public.blog_posts (slug, title, excerpt, content, cover_image_url, published, published_at) VALUES
('maize-prices-rise-techiman', 'Maize prices climb 4% at Techiman as harvest slows', 'A cool spell across Bono East has slowed maize drying, tightening supply at Techiman market and pushing the 100kg bag to GH₵ 620.', E'Traders at Techiman market reported a 4.2% week-on-week rise in the price of a 100kg bag of maize, now selling at GH₵ 620.\n\nField officers say the cool nights across Bono East have slowed drying at farm level, thinning what usually arrives in bulk on Wednesdays. Aggregators travelling from Kumasi and Accra have had to bid higher to secure stock.\n\n"Farmers who dried early are getting the best price this week," said Ama, an AgriFarm officer at Techiman. "We are encouraging farmers within 40km to check the price before travelling."\n\nAgriFarm will continue to track daily quotes and publish morning updates via SMS.', null, true, now() - interval '2 days'),
('sms-alerts-launch', 'SMS price alerts now live for every farmer', 'You can now text a crop name to our shortcode and receive today''s price from the nearest tracked market — no internet required.', E'Starting this week, farmers on any phone in Ghana can text a crop name (for example "PRICE MAIZE") to the AgriFarm shortcode and receive today''s price from the nearest tracked market by SMS.\n\nThe service uses Africa''s Talking and is free to end users during the pilot. It supports maize, tomato, cassava, yam, plantain, and pepper to start; more crops are being added as officers onboard.\n\nWe designed the SMS flow for the reality of farming: patchy data, shared phones, and a need for a straight answer before deciding whether to travel.', null, true, now() - interval '7 days'),
('officer-network-grows', 'Officer network expands to eight markets', 'AgriFarm officers now cover Agbogbloshie, Kaneshie, Makola, Kejetia, Techiman, Tamale Central, Ho Central, and Takoradi Market Circle.', E'AgriFarm''s field-officer network has grown to eight markets across five regions. Each officer records daily prices for tracked crops, and submissions are cross-checked before publishing to filter out clerical errors and rumours.\n\nOur next markets are Wa and Bolgatanga, targeted for the next planting season. If you know a market that should be on our map, tell your officer or email the team.', null, true, now() - interval '14 days');
