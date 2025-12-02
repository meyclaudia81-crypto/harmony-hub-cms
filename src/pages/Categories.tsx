import { Layout } from "@/components/layout/Layout";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/categories/CategoryCard";

const Categories = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Our Collection
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mt-2 mb-4">
            Instrument Categories
          </h1>
          <p className="text-cream/70 max-w-2xl mx-auto">
            Browse our extensive collection of premium musical instruments. Each
            category features handpicked instruments from the world's finest
            manufacturers.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-display text-2xl font-semibold mb-4">
                No Categories Yet
              </h2>
              <p className="text-muted-foreground">
                Check back soon for our collection of instruments.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
