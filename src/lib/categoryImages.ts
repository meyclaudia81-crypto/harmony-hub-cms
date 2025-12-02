import pianosImg from "@/assets/categories/pianos.jpg";
import guitarsImg from "@/assets/categories/guitars.jpg";
import drumsImg from "@/assets/categories/drums.jpg";
import violinsImg from "@/assets/categories/violins.jpg";
import keyboardsImg from "@/assets/categories/keyboards.jpg";
import windImg from "@/assets/categories/wind.jpg";

export const categoryImages: Record<string, string> = {
  "pianos": pianosImg,
  "guitars": guitarsImg,
  "drums": drumsImg,
  "violins": violinsImg,
  "keyboards": keyboardsImg,
  "wind instruments": windImg,
};

export function getCategoryImage(categoryName: string): string | undefined {
  const normalizedName = categoryName.toLowerCase();
  return categoryImages[normalizedName];
}
