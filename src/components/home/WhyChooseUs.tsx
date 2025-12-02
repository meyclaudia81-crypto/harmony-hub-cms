import { Award, Shield, Truck, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We source only the finest instruments from world-renowned manufacturers.",
  },
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    description:
      "Every instrument comes with a certificate of authenticity and warranty.",
  },
  {
    icon: Truck,
    title: "Expert Delivery",
    description:
      "Professional handling and delivery to ensure your instrument arrives safely.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description:
      "Our team of musicians is here to help you find your perfect instrument.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            The HarmonyMusic Difference
          </h2>
          <p className="text-muted-foreground">
            With over 20 years of experience, we're committed to helping
            musicians find their perfect instrument.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl hover:bg-muted/50 transition-colors duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
