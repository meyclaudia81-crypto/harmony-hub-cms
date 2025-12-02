-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subcategories table
CREATE TABLE public.subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Instruments table
CREATE TABLE public.instruments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  model TEXT,
  brand TEXT,
  description TEXT,
  specifications JSONB DEFAULT '{}',
  price DECIMAL(10,2),
  contact_for_price BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Instrument images table
CREATE TABLE public.instrument_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site settings table for editable content
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  instrument_id UUID REFERENCES public.instruments(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin users table (simple admin check)
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instrument_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog data
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Anyone can view instruments" ON public.instruments FOR SELECT USING (true);
CREATE POLICY "Anyone can view instrument images" ON public.instrument_images FOR SELECT USING (true);
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);

-- Anyone can submit contact messages
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE admin_users.user_id = $1
  )
$$;

-- Admin policies for full CRUD
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage subcategories" ON public.subcategories FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage instruments" ON public.instruments FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage instrument images" ON public.instrument_images FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages FOR DELETE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT USING (public.is_admin(auth.uid()));

-- Create storage bucket for instrument images
INSERT INTO storage.buckets (id, name, public) VALUES ('instruments', 'instruments', true);

-- Storage policies
CREATE POLICY "Anyone can view instrument images" ON storage.objects FOR SELECT USING (bucket_id = 'instruments');
CREATE POLICY "Admins can upload instrument images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'instruments' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update instrument images" ON storage.objects FOR UPDATE USING (bucket_id = 'instruments' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete instrument images" ON storage.objects FOR DELETE USING (bucket_id = 'instruments' AND public.is_admin(auth.uid()));

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES 
('hero', '{"title": "Discover Your Perfect Instrument", "subtitle": "Premium musical instruments from world-renowned brands", "cta_text": "Explore Collection"}'),
('contact', '{"phone": "+1 (555) 123-4567", "email": "info@harmonymusic.com", "whatsapp": "+15551234567", "address": "123 Music Avenue, Symphony City, SC 12345"}'),
('about', '{"text": "We are passionate about connecting musicians with their perfect instruments. With over 20 years of experience, we offer only the finest selection of musical instruments from trusted brands worldwide."}');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON public.subcategories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_instruments_updated_at BEFORE UPDATE ON public.instruments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();