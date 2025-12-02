import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ContactForm } from "@/components/contact/ContactForm";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const contact = settings?.contact;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mt-2 mb-4">
            Contact Us
          </h1>
          <p className="text-cream/70 max-w-2xl mx-auto">
            Have questions about our instruments? We're here to help you find
            your perfect musical companion.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                Let's Start a Conversation
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Whether you're looking for your first instrument or adding to
                your collection, our team of musicians and experts is here to
                guide you every step of the way.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4">
                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card hover:shadow-elegant transition-shadow group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Call Us
                      </div>
                      <div className="font-semibold group-hover:text-gold transition-colors">
                        {contact.phone}
                      </div>
                    </div>
                  </a>
                )}

                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card hover:shadow-elegant transition-shadow group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Email Us
                      </div>
                      <div className="font-semibold group-hover:text-gold transition-colors">
                        {contact.email}
                      </div>
                    </div>
                  </a>
                )}

                {contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card hover:shadow-elegant transition-shadow group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <MessageCircle className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        WhatsApp
                      </div>
                      <div className="font-semibold group-hover:text-gold transition-colors">
                        Message Us
                      </div>
                    </div>
                  </a>
                )}

                {contact?.address && (
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Visit Us
                      </div>
                      <div className="font-semibold">{contact.address}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Business Hours
                    </div>
                    <div className="font-semibold">Mon - Sat: 9AM - 7PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-card">
                <h3 className="font-display text-xl font-semibold mb-6">
                  Send Us a Message
                </h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
