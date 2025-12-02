import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useCategory, useSubcategories } from "@/hooks/useCategories";
import { useInstruments } from "@/hooks/useInstruments";
import { InstrumentCard } from "@/components/instruments/InstrumentCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CategoryDetail = () => {
  const { id, subcategoryId } = useParams<{
    id: string;
    subcategoryId?: string;
  }>();
  const { data: category, isLoading: categoryLoading } = useCategory(id!);
  const { data: subcategories } = useSubcategories(id);
  const { data: instruments, isLoading: instrumentsLoading } = useInstruments({
    categoryId: id,
    subcategoryId: subcategoryId,
  });

  if (categoryLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">
              Category Not Found
            </h1>
            <Button asChild>
              <Link to="/categories">Back to Categories</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const activeSubcategory = subcategories?.find((s) => s.id === subcategoryId);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-hero overflow-hidden">
        {category.image_url && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-cream/60 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/categories" className="hover:text-gold transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-cream">{category.name}</span>
            {activeSubcategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gold">{activeSubcategory.name}</span>
              </>
            )}
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mb-4">
            {activeSubcategory?.name || category.name}
          </h1>
          {(activeSubcategory?.description || category.description) && (
            <p className="text-cream/70 max-w-2xl">
              {activeSubcategory?.description || category.description}
            </p>
          )}
        </div>
      </section>

      {/* Subcategories Filter */}
      {subcategories && subcategories.length > 0 && (
        <section className="py-6 bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!subcategoryId ? "gold" : "outline"}
                size="sm"
                asChild
              >
                <Link to={`/categories/${id}`}>All</Link>
              </Button>
              {subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant={subcategoryId === sub.id ? "gold" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link to={`/categories/${id}/subcategory/${sub.id}`}>
                    {sub.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instruments Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {instrumentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : instruments && instruments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instruments.map((instrument, index) => (
                <InstrumentCard
                  key={instrument.id}
                  instrument={instrument}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-display text-2xl font-semibold mb-4">
                No Instruments Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                This category doesn't have any instruments yet.
              </p>
              <Button asChild>
                <Link to="/categories">Browse Other Categories</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryDetail;
