import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useInstruments } from "@/hooks/useInstruments";
import { useCategories, useSubcategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InstrumentWithImages } from "@/types/database";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InstrumentForm {
  name: string;
  model: string;
  brand: string;
  description: string;
  category_id: string;
  subcategory_id: string;
  price: string;
  contact_for_price: boolean;
  featured: boolean;
  image_urls: string[];
}

const initialForm: InstrumentForm = {
  name: "",
  model: "",
  brand: "",
  description: "",
  category_id: "",
  subcategory_id: "",
  price: "",
  contact_for_price: false,
  featured: false,
  image_urls: [""],
};

export function InstrumentsManager() {
  const { data: instruments, isLoading } = useInstruments();
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InstrumentWithImages | null>(null);
  const [form, setForm] = useState<InstrumentForm>(initialForm);

  const filteredSubcategories = subcategories?.filter(
    (s) => s.category_id === form.category_id
  );

  const saveMutation = useMutation({
    mutationFn: async (data: InstrumentForm & { id?: string }) => {
      const instrumentData = {
        name: data.name,
        model: data.model || null,
        brand: data.brand || null,
        description: data.description || null,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id || null,
        price: data.price ? parseFloat(data.price) : null,
        contact_for_price: data.contact_for_price,
        featured: data.featured,
      };

      let instrumentId = data.id;

      if (data.id) {
        const { error } = await supabase
          .from("instruments")
          .update(instrumentData)
          .eq("id", data.id);
        if (error) throw error;

        // Delete existing images
        await supabase
          .from("instrument_images")
          .delete()
          .eq("instrument_id", data.id);
      } else {
        const { data: newInstrument, error } = await supabase
          .from("instruments")
          .insert(instrumentData)
          .select()
          .single();
        if (error) throw error;
        instrumentId = newInstrument.id;
      }

      // Insert new images
      const validImages = data.image_urls.filter((url) => url.trim());
      if (validImages.length > 0 && instrumentId) {
        const imageInserts = validImages.map((url, index) => ({
          instrument_id: instrumentId,
          image_url: url,
          is_primary: index === 0,
          display_order: index,
        }));

        const { error: imageError } = await supabase
          .from("instrument_images")
          .insert(imageInserts);
        if (imageError) throw imageError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instruments"] });
      setDialogOpen(false);
      setEditing(null);
      setForm(initialForm);
      toast({ title: "Success", description: "Instrument saved successfully." });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save instrument.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("instruments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instruments"] });
      toast({ title: "Deleted", description: "Instrument deleted successfully." });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete instrument.",
        variant: "destructive",
      });
    },
  });

  const openEdit = (instrument: InstrumentWithImages) => {
    setEditing(instrument);
    setForm({
      name: instrument.name,
      model: instrument.model || "",
      brand: instrument.brand || "",
      description: instrument.description || "",
      category_id: instrument.category_id,
      subcategory_id: instrument.subcategory_id || "",
      price: instrument.price?.toString() || "",
      contact_for_price: instrument.contact_for_price,
      featured: instrument.featured,
      image_urls:
        instrument.instrument_images?.map((img) => img.image_url) || [""],
    });
    setDialogOpen(true);
  };

  const addImageField = () => {
    setForm({ ...form, image_urls: [...form.image_urls, ""] });
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...form.image_urls];
    newUrls[index] = url;
    setForm({ ...form, image_urls: newUrls });
  };

  const removeImageField = (index: number) => {
    const newUrls = form.image_urls.filter((_, i) => i !== index);
    setForm({ ...form, image_urls: newUrls.length ? newUrls : [""] });
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
          <h1 className="font-display text-3xl font-bold">Instruments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your instrument inventory
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="gold"
              onClick={() => {
                setEditing(null);
                setForm(initialForm);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Instrument
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Instrument" : "Add Instrument"}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveMutation.mutate({ ...form, id: editing?.id });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      disabled={form.contact_for_price}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={form.category_id}
                      onValueChange={(value) =>
                        setForm({ ...form, category_id: value, subcategory_id: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Select
                      value={form.subcategory_id}
                      onValueChange={(value) =>
                        setForm({ ...form, subcategory_id: value })
                      }
                      disabled={!form.category_id || !filteredSubcategories?.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories?.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="contactForPrice"
                      checked={form.contact_for_price}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, contact_for_price: checked })
                      }
                    />
                    <Label htmlFor="contactForPrice">Contact for Price</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={form.featured}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, featured: checked })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Images</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addImageField}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Image
                    </Button>
                  </div>
                  {form.image_urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <ImageUpload
                          value={url}
                          onChange={(newUrl) => updateImageUrl(index, newUrl)}
                          folder="instruments"
                        />
                      </div>
                      {form.image_urls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImageField(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full"
                  disabled={saveMutation.isPending || !form.category_id}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Instrument"
                  )}
                </Button>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Instruments Grid */}
      {instruments && instruments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((instrument) => {
            const primaryImage = instrument.instrument_images?.find(
              (img) => img.is_primary
            );
            const imageUrl =
              primaryImage?.image_url || instrument.instrument_images?.[0]?.image_url;

            return (
              <div
                key={instrument.id}
                className="bg-card rounded-xl shadow-card overflow-hidden"
              >
                <div className="relative h-48 bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={instrument.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {instrument.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-gold text-navy text-xs font-semibold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-gold font-medium mb-1">
                    {instrument.categories?.name}
                  </div>
                  <h3 className="font-display font-semibold mb-1">
                    {instrument.name}
                  </h3>
                  {instrument.brand && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {instrument.brand}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-semibold text-gold">
                      {instrument.contact_for_price || !instrument.price
                        ? "Contact for Price"
                        : `$${instrument.price.toLocaleString()}`}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(instrument)}
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
                            <AlertDialogTitle>Delete Instrument?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(instrument.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl">
          <h3 className="font-display text-xl font-semibold mb-2">
            No Instruments Yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Add your first instrument to get started.
          </p>
        </div>
      )}
    </div>
  );
}
