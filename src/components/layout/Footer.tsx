import { Link } from "react-router-dom";
import { Music, Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const contact = settings?.contact;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Music className="w-5 h-5 text-navy" />
              </div>
              <span className="font-display text-xl font-semibold">
                Harmony<span className="text-gold">Music</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {settings?.about?.text?.slice(0, 150)}...
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-gold">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/categories"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Instruments
              </Link>
              <Link
                to="/contact"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-gold">
              Categories
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/categories"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Pianos
              </Link>
              <Link
                to="/categories"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Guitars
              </Link>
              <Link
                to="/categories"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Drums
              </Link>
              <Link
                to="/categories"
                className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
              >
                Violins
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-gold">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </a>
              )}
              {contact?.address && (
                <div className="flex items-start gap-2 text-sm text-primary-foreground/70">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {contact.address}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} HarmonyMusic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
