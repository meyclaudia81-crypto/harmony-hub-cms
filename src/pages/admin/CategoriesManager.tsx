import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, FolderPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, useSubcategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Category, Subcategory } from "@/types/database";
import { ImageUpload } from "@/components/admin/ImageUpload";

export function CategoriesManager() {
  const { data: categories, isLoading } = useCategories();
  const { data: subcategories } = useSubcategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (data: typeof categoryForm & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: data.name,
            description: data.description,
            image_url: data.image_url,
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert({
          name: data.name,
          description: data.description,
          image_url: data.image_url,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "", image_url: "" });
      toast({ title: "Success", description: "Category saved successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save category.", variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Deleted", description: "Category deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    },
  });

  const saveSubcategoryMutation = useMutation({
    mutationFn: async (data: typeof subcategoryForm & { id?: string; category_id: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from("subcategories")
          .update({
            name: data.name,
            description: data.description,
            image_url: data.image_url,
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("subcategories").insert({
          category_id: data.category_id,
          name: data.name,
          description: data.description,
          image_url: data.image_url,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      setSubcategoryDialogOpen(false);
      setEditingSubcategory(null);
      setSelectedCategoryId(null);
      setSubcategoryForm({ name: "", description: "", image_url: "" });
      toast({ title: "Success", description: "Subcategory saved successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save subcategory.", variant: "destructive" });
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subcategories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Deleted", description: "Subcategory deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete subcategory.", variant: "destructive" });
    },
  });

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
    });
    setCategoryDialogOpen(true);
  };

  const openAddSubcategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setEditingSubcategory(null);
    setSubcategoryForm({ name: "", description: "", image_url: "" });
    setSubcategoryDialogOpen(true);
  };

  const openEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSelectedCategoryId(subcategory.category_id);
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description || "",
      image_url: subcategory.image_url || "",
    });
    setSubcategoryDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage instrument categories and subcategories
          </p>
        </div>

        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="gold"
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: "", description: "", image_url: "" });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCategoryMutation.mutate({
                  ...categoryForm,
                  id: editingCategory?.id,
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUpload
                  value={categoryForm.image_url}
                  onChange={(url) =>
                    setCategoryForm({ ...categoryForm, image_url: url })
                  }
                  folder="categories"
                />
              </div>
              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={saveCategoryMutation.isPending}
              >
                {saveCategoryMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Category"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {categories && categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((category) => {
            const categorySubcategories = subcategories?.filter(
              (s) => s.category_id === category.id
            );

            return (
              <div
                key={category.id}
                className="bg-card rounded-xl shadow-card overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openAddSubcategory(category.id)}
                    >
                      <FolderPlus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditCategory(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete the category and all its instruments.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCategoryMutation.mutate(category.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Subcategories */}
                {categorySubcategories && categorySubcategories.length > 0 && (
                  <div className="p-4 bg-muted/30">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Subcategories
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorySubcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full text-sm"
                        >
                          <span>{sub.name}</span>
                          <button
                            onClick={() => openEditSubcategory(sub)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Subcategory?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteSubcategoryMutation.mutate(sub.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl">
          <h3 className="font-display text-xl font-semibold mb-2">
            No Categories Yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create your first category to get started.
          </p>
        </div>
      )}

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory ? "Edit Subcategory" : "Add Subcategory"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedCategoryId) return;
              saveSubcategoryMutation.mutate({
                ...subcategoryForm,
                id: editingSubcategory?.id,
                category_id: selectedCategoryId,
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="subName">Name</Label>
              <Input
                id="subName"
                value={subcategoryForm.name}
                onChange={(e) =>
                  setSubcategoryForm({ ...subcategoryForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subDescription">Description</Label>
              <Textarea
                id="subDescription"
                value={subcategoryForm.description}
                onChange={(e) =>
                  setSubcategoryForm({ ...subcategoryForm, description: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={saveSubcategoryMutation.isPending}
            >
              {saveSubcategoryMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Subcategory"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
