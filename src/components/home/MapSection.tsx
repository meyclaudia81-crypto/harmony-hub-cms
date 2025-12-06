import { MapPin } from "lucide-react";

export function MapSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-4">
            <MapPin className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Visit Our Store</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Us Here
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Come visit our showroom and experience our collection of premium musical instruments in person.
          </p>
        </div>
        
        <div className="rounded-2xl overflow-hidden shadow-xl border border-border/50">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.882765477297!2d-0.1641801!3d5.5843419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b06e2e70993%3A0x12dcdfa85a5034dc!2sVobiss%20Solutions%20Ltd.!5e0!3m2!1sen!2sgh!4v1765048687955!5m2!1sen!2sgh"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
