"use client";

import { useEffect, useState } from "react";
import { getAuthData } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { menuService } from "@/services/menuService";
import { CreateMenuItemRequest } from "@/types/api";
import { Category, MenuItem } from "@/types/models/restaurantModels";
import toast from "react-hot-toast";

export default function MenuManagementPage() {
  const router = useRouter();

  // State za podatke
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // State za forme (Modali)
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [newItem, setNewItem] = useState<CreateMenuItemRequest>({
    name: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    const user = getAuthData();
    if (!user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [i, c] = await Promise.all([
        menuService.getAllItems(),
        menuService.getAllCategories(),
      ]);
      setItems(i);
      setCategories(c);
    } catch (err) {
      toast.error("Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await menuService.createCategory(newCategoryName);
      toast.success("Kategorija dodata!");
      setNewCategoryName("");
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      toast.error("Greška.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        "Da li ste sigurni? Brisanje kategorije briše i sva jela u njoj!",
      )
    )
      return;
    try {
      await menuService.deleteCategory(id);
      fetchData();
    } catch (err) {
      toast.error("Nije moguće obrisati kategoriju.");
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return toast.error("Izaberite kategoriju");
    try {
      await menuService.createMenuItem(newItem, Number(selectedCategoryId));
      toast.success("Jelo dodato!");
      setNewItem({ name: "", description: "", price: 0 });
      fetchData();
    } catch (err) {
      toast.error("Greška pri kreiranju jela.");
    }
  };

  const handleToggleAvailability = async (id: number, current: boolean) => {
    try {
      await menuService.toggleMenuItemAvailability(id, !current);
      setItems(
        items.map((i) => (i.id === id ? { ...i, available: !current } : i)),
      );
    } catch (err) {
      toast.error("Greška.");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Obrisati jelo?")) return;
    try {
      await menuService.deleteMenuItem(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      toast.error("Greška pri brisanju.");
    }
  };

  if (loading)
    return <div className="text-slate-400">Učitavanje admin panela...</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Upravljanje Menijem</h2>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-slate-800 hover:bg-slate-700 text-amber-500 px-4 py-2 rounded-lg border border-slate-700 font-medium transition-all"
        >
          + Nova Kategorija
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* FORMA ZA NOVO JELO */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
          <h3 className="text-lg font-bold mb-6 text-amber-500">
            Dodaj novo jelo
          </h3>
          <form onSubmit={handleCreateItem} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase font-bold mb-1 ml-1">
                Kategorija
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  const val = e.target.value;
                  // Ako je prazan string (opcija "Izaberi..."), postavi "", inače konvertuj u Number
                  setSelectedCategoryId(val === "" ? "" : Number(val));
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
              >
                <option value="">Izaberi...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              placeholder="Naziv jela"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
            />
            <textarea
              placeholder="Opis"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none h-24"
            />
            <input
              type="number"
              placeholder="Cena (RSD)"
              value={newItem.price || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, price: Number(e.target.value) })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
            />
            <button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-all">
              SAČUVAJ JELO
            </button>
          </form>
        </div>

        {/* TABELA JELA */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-4">Jelo</th>
                <th className="p-4">Kategorija</th>
                <th className="p-4">Cena</th>
                <th className="p-4">Dostupno</th>
                <th className="p-4 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">
                      {item.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                      {item.category.name}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-amber-500">
                    {item.price} RSD
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleToggleAvailability(item.id, item.available)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.available ? "bg-amber-500" : "bg-slate-700"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.available ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-500 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ZA KATEGORIJU */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white text-center">
              Nova Kategorija
            </h3>
            <input
              autoFocus
              placeholder="Naziv (npr. Dezerti)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none mb-6"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 text-slate-400 font-bold py-3"
              >
                Odustani
              </button>
              <button
                onClick={handleCreateCategory}
                className="flex-1 bg-amber-500 text-slate-950 font-bold py-3 rounded-xl"
              >
                Kreiraj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
