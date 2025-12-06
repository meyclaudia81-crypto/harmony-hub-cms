import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesPreview } from "@/components/home/CategoriesPreview";
import { FeaturedInstruments } from "@/components/home/FeaturedInstruments";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CTASection } from "@/components/home/CTASection";
import { MapSection } from "@/components/home/MapSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesPreview />
      <FeaturedInstruments />
      <WhyChooseUs />
      <CTASection />
      <MapSection />
    </Layout>
  );
};

export default Index;
