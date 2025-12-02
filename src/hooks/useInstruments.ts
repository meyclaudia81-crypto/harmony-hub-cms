import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InstrumentWithImages } from "@/types/database";

export function useInstruments(filters?: {
  categoryId?: string;
  subcategoryId?: string;
  featured?: boolean;
  brand?: string;
}) {
  return useQuery({
    queryKey: ["instruments", filters],
    queryFn: async () => {
      let query = supabase
        .from("instruments")
        .select(`
          *,
          instrument_images (*),
          categories (*),
          subcategories (*)
        `)
        .order("created_at", { ascending: false });

      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }
      if (filters?.subcategoryId) {
        query = query.eq("subcategory_id", filters.subcategoryId);
      }
      if (filters?.featured) {
        query = query.eq("featured", true);
      }
      if (filters?.brand) {
        query = query.eq("brand", filters.brand);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as InstrumentWithImages[];
    },
  });
}

export function useInstrument(id: string) {
  return useQuery({
    queryKey: ["instrument", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instruments")
        .select(`
          *,
          instrument_images (*),
          categories (*),
          subcategories (*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as InstrumentWithImages | null;
    },
    enabled: !!id,
  });
}

export function useFeaturedInstruments() {
  return useInstruments({ featured: true });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instruments")
        .select("brand")
        .not("brand", "is", null);

      if (error) throw error;
      const uniqueBrands = [...new Set(data.map((d) => d.brand).filter(Boolean))];
      return uniqueBrands as string[];
    },
  });
}
