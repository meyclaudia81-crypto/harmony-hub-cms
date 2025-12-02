import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SiteSetting } from "@/types/database";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      const settings: Record<string, Record<string, string>> = {};
      (data as SiteSetting[]).forEach((item) => {
        settings[item.key] = item.value;
      });

      return settings;
    },
  });
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ["site-setting", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return data as SiteSetting | null;
    },
    enabled: !!key,
  });
}
