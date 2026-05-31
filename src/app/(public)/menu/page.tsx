"use client";

import CategoryFilter from "@/components/menu/CategoryFilter";
import MenuList from "@/components/menu/MenuList";
import { menuService } from "@/services/menuService";
import { Category, MenuItem } from "@/types/models/restaurantModels";
import { useEffect, useState } from "react";

const PublicMenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, categoriesData] = await Promise.all([
          menuService.getAllItems(),
          menuService.getAllCategories(),
        ]);
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Greška pri učitavanju menija:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category.id === selectedCategory)
    : items;

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-500 tracking-tight">
            MENI
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="mt-12">
          <MenuList items={filteredItems} />
        </div>
      </div>
    </main>
  );
};

export default PublicMenuPage;
