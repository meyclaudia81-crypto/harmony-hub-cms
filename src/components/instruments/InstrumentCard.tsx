import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { InstrumentWithImages } from "@/types/database";
import { Button } from "@/components/ui/button";

interface InstrumentCardProps {
  instrument: InstrumentWithImages;
  index?: number;
}

export function InstrumentCard({ instrument, index = 0 }: InstrumentCardProps) {
  const primaryImage = instrument.instrument_images?.find(
    (img) => img.is_primary
  );
  const imageUrl =
    primaryImage?.image_url || instrument.instrument_images?.[0]?.image_url;

  const formatPrice = (price: number | null, contactForPrice: boolean) => {
    if (contactForPrice || !price) {
      return "Contact for Price";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <Link
        to={`/instruments/${instrument.id}`}
        className="block relative h-64 overflow-hidden bg-muted"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={instrument.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}

        {/* Featured Badge */}
        {instrument.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy text-xs font-semibold rounded-full">
            Featured
          </div>
        )}

        {/* Brand Badge */}
        {instrument.brand && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-navy/80 text-cream text-xs font-medium rounded-full">
            {instrument.brand}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2">
          {instrument.categories && (
            <span className="text-gold text-xs font-medium uppercase tracking-wider">
              {instrument.categories.name}
            </span>
          )}
        </div>

        <Link to={`/instruments/${instrument.id}`}>
          <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-gold transition-colors">
            {instrument.name}
          </h3>
        </Link>

        {instrument.model && (
          <p className="text-muted-foreground text-sm mb-3">
            {instrument.model}
          </p>
        )}

        {instrument.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {instrument.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-gold">
            {formatPrice(instrument.price, instrument.contact_for_price)}
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/instruments/${instrument.id}`}>
              View Details
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
