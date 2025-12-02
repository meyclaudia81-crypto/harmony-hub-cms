import { useParams, Link } from "react-router-dom";
import { ChevronRight, Phone, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useInstrument } from "@/hooks/useInstruments";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { InstrumentGallery } from "@/components/instruments/InstrumentGallery";
import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/button";

const InstrumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: instrument, isLoading } = useInstrument(id!);
  const { data: settings } = useSiteSettings();
  const contact = settings?.contact;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!instrument) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">
              Instrument Not Found
            </h1>
            <Button asChild>
              <Link to="/categories">Browse Instruments</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number | null, contactForPrice: boolean) => {
    if (contactForPrice || !price) {
      return "Contact for Price";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const specs = instrument.specifications || {};
  const specEntries = Object.entries(specs);

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="py-4 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto">
            <Link to="/" className="hover:text-gold transition-colors whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link to="/categories" className="hover:text-gold transition-colors whitespace-nowrap">
              Categories
            </Link>
            {instrument.categories && (
              <>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                <Link
                  to={`/categories/${instrument.category_id}`}
                  className="hover:text-gold transition-colors whitespace-nowrap"
                >
                  {instrument.categories.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-foreground truncate">{instrument.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="animate-fade-up">
              <InstrumentGallery
                images={instrument.instrument_images || []}
                name={instrument.name}
              />
            </div>

            {/* Details */}
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {/* Category & Brand */}
              <div className="flex flex-wrap gap-2 mb-4">
                {instrument.categories && (
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    {instrument.categories.name}
                  </span>
                )}
                {instrument.brand && (
                  <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full">
                    {instrument.brand}
                  </span>
                )}
              </div>

              {/* Name & Model */}
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                {instrument.name}
              </h1>
              {instrument.model && (
                <p className="text-muted-foreground text-lg mb-6">
                  Model: {instrument.model}
                </p>
              )}

              {/* Price */}
              <div className="mb-8">
                <span className="font-display text-3xl font-bold text-gold">
                  {formatPrice(instrument.price, instrument.contact_for_price)}
                </span>
              </div>

              {/* Description */}
              {instrument.description && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-semibold mb-3">
                    Description
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {instrument.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {specEntries.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-semibold mb-3">
                    Specifications
                  </h2>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {specEntries.map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-sm text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </dt>
                          <dd className="font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold">
                  Interested in this instrument?
                </h2>
                <div className="flex flex-wrap gap-3">
                  {contact?.phone && (
                    <Button variant="gold" size="lg" asChild>
                      <a href={`tel:${contact.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Us
                      </a>
                    </Button>
                  )}
                  {contact?.whatsapp && (
                    <Button variant="outline" size="lg" asChild>
                      <a
                        href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in the ${instrument.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="mt-16 pt-16 border-t border-border">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-card">
                <ContactForm
                  instrumentId={instrument.id}
                  instrumentName={instrument.name}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InstrumentDetail;
