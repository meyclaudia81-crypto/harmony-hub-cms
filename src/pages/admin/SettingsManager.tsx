import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function SettingsManager() {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
    cta_text: "",
  });

  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
  });

  const [aboutForm, setAboutForm] = useState({
    text: "",
  });

  useEffect(() => {
    if (settings) {
      if (settings.hero) {
        setHeroForm({
          title: settings.hero.title || "",
          subtitle: settings.hero.subtitle || "",
          cta_text: settings.hero.cta_text || "",
        });
      }
      if (settings.contact) {
        setContactForm({
          phone: settings.contact.phone || "",
          email: settings.contact.email || "",
          whatsapp: settings.contact.whatsapp || "",
          address: settings.contact.address || "",
        });
      }
      if (settings.about) {
        setAboutForm({
          text: settings.about.text || "",
        });
      }
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: string;
      value: Record<string, string>;
    }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Saved", description: "Settings updated successfully." });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your website content and settings
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-display text-xl font-semibold mb-6">
          Homepage Hero
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate({ key: "hero", value: heroForm });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input
              id="heroTitle"
              value={heroForm.title}
              onChange={(e) =>
                setHeroForm({ ...heroForm, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={heroForm.subtitle}
              onChange={(e) =>
                setHeroForm({ ...heroForm, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroCta">CTA Button Text</Label>
            <Input
              id="heroCta"
              value={heroForm.cta_text}
              onChange={(e) =>
                setHeroForm({ ...heroForm, cta_text: e.target.value })
              }
            />
          </div>
          <Button
            type="submit"
            variant="gold"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Hero Settings
          </Button>
        </form>
      </div>

      {/* Contact Section */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-display text-xl font-semibold mb-6">
          Contact Information
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate({ key: "contact", value: contactForm });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={contactForm.whatsapp}
                onChange={(e) =>
                  setContactForm({ ...contactForm, whatsapp: e.target.value })
                }
                placeholder="+15551234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={contactForm.address}
                onChange={(e) =>
                  setContactForm({ ...contactForm, address: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="gold"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Contact Settings
          </Button>
        </form>
      </div>

      {/* About Section */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-display text-xl font-semibold mb-6">About Text</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate({ key: "about", value: aboutForm });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="aboutText">About Text (shown in footer)</Label>
            <Textarea
              id="aboutText"
              value={aboutForm.text}
              onChange={(e) =>
                setAboutForm({ ...aboutForm, text: e.target.value })
              }
              rows={4}
            />
          </div>
          <Button
            type="submit"
            variant="gold"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save About Settings
          </Button>
        </form>
      </div>
    </div>
  );
}
