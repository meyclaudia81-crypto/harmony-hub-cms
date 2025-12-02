export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Instrument {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  model: string | null;
  brand: string | null;
  description: string | null;
  specifications: Record<string, string>;
  price: number | null;
  contact_for_price: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface InstrumentImage {
  id: string;
  instrument_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, string>;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  instrument_id: string | null;
  read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at: string;
}

export interface InstrumentWithImages extends Instrument {
  instrument_images: InstrumentImage[];
  categories?: Category;
  subcategories?: Subcategory | null;
}
