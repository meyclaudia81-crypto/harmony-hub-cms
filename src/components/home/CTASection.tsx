import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function CTASection() {
  const { data: settings } = useSiteSettings();
  const contact = settings?.contact;

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--gold) / 0.3) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
            Ready to Find Your Perfect Instrument?
          </h2>
          <p className="text-cream/70 text-lg mb-10">
            Contact us today and let our experts help you discover the
            instrument that matches your musical journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            {contact?.phone && (
              <Button variant="hero-outline" size="xl" asChild>
                <a href={`tel:${contact.phone}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {contact.phone}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
