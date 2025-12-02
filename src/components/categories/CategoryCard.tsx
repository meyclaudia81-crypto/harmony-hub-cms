import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/database";
import { getCategoryImage } from "@/lib/categoryImages";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const imageUrl = category.image_url || getCategoryImage(category.name);

  return (
    <Link
      to={`/categories/${category.id}`}
      className="group relative block h-80 rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="font-display text-2xl font-semibold text-cream mb-2 group-hover:text-gold transition-colors duration-300">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-cream/70 text-sm line-clamp-2 mb-4">
            {category.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-gold font-medium text-sm">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}
