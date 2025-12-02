import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function HeroSection() {
  const { data: settings } = useSiteSettings();
  const hero = settings?.hero;

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--gold) / 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, hsl(var(--gold) / 0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm text-gold font-medium">
              Premium Musical Instruments
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {hero?.title || "Discover Your Perfect Instrument"}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {hero?.subtitle ||
              "Premium musical instruments from world-renowned brands. Find your sound with our curated collection."}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/categories">
                {hero?.cta_text || "Explore Collection"}
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/contact">
                <Play className="w-5 h-5 mr-1" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-cream/10 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-gold mb-1">
                500+
              </div>
              <div className="text-sm text-cream/60">Instruments</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-gold mb-1">
                50+
              </div>
              <div className="text-sm text-cream/60">Brands</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-gold mb-1">
                20+
              </div>
              <div className="text-sm text-cream/60">Years</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
