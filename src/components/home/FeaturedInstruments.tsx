import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFeaturedInstruments } from "@/hooks/useInstruments";
import { Button } from "@/components/ui/button";
import { InstrumentCard } from "@/components/instruments/InstrumentCard";

export function FeaturedInstruments() {
  const { data: instruments, isLoading } = useFeaturedInstruments();

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayInstruments = instruments?.slice(0, 6) || [];

  if (displayInstruments.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-gold font-medium text-sm uppercase tracking-wider">
              Handpicked for You
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              Featured Instruments
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/categories">
              View All Instruments
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Instruments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayInstruments.map((instrument, index) => (
            <InstrumentCard
              key={instrument.id}
              instrument={instrument}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
