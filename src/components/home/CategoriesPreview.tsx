import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/categories/CategoryCard";

export function CategoriesPreview() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayCategories = categories?.slice(0, 4) || [];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-gold font-medium text-sm uppercase tracking-wider">
              Browse by Category
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              Explore Our Collection
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/categories">
              View All Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Categories Grid */}
        {displayCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-xl">
            <p className="text-muted-foreground">
              No categories available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
