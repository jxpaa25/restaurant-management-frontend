"use client";

import { useState, useEffect } from "react";
import { menuService } from "@/services/menuService";
import { ordersService } from "@/services/ordersService";
import { toast } from "react-hot-toast";
import { MenuItem, RestaurantTable } from "@/types/models/restaurantModels";
import { restaurantTableService } from "@/services/restaurantTableService";
import { CreateOrderRequest } from "@/types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewOrderModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [cart, setCart] = useState<{ menuItem: MenuItem; quantity: number }[]>(
    [],
  );

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      const [t, i] = await Promise.all([
        restaurantTableService.getAllTables(),
        menuService.getAllItems(),
      ]);
      setTables(t.filter((table) => table.status === "FREE"));
      setItems(i.filter((item) => item.available));
    } catch (error) {
      toast.error("Greška pri učitavanju podataka");
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleOrder = async () => {
    if (!selectedTable || cart.length === 0) return;
    try {
      const payload: CreateOrderRequest = {
        tableNumber: selectedTable,
        items: cart.map((c) => ({
          menuItemId: c.menuItem.id,
          quantity: c.quantity,
        })),
      };
      await ordersService.createOrder(payload);
      toast.success("Porudžbina poslata!");
      setCart([]);
      setSelectedTable(null);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Greška pri slanju porudžbine");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[85vh] rounded-3xl flex overflow-hidden shadow-2xl">
        {/* LEVA STRANA: Stolovi i Meni */}
        <div className="flex-1 flex flex-col border-r border-slate-800 p-6 overflow-hidden">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
            1. Izaberi sto
          </h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTable(t.tableNumber)}
                className={`h-12 w-12 rounded-xl border font-bold transition-all ${
                  selectedTable === t.tableNumber
                    ? "bg-amber-500 border-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {t.tableNumber}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
            2. Dodaj stavke
          </h3>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 scrollbar-hide">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-left hover:border-amber-500/40 transition-all active:scale-95"
              >
                <div className="font-semibold text-slate-200">{item.name}</div>
                <div className="text-amber-500 text-sm font-mono">
                  {item.price} RSD
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* DESNA STRANA: Pregled i slanje */}
        <div className="w-80 bg-slate-950/50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Korpa</h3>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {cart.map((c, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start text-sm"
              >
                <div className="max-w-[150px]">
                  <div className="text-slate-200 font-medium">
                    {c.menuItem.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {c.quantity} x {c.menuItem.price}
                  </div>
                </div>
                <div className="font-bold text-amber-500">
                  {c.quantity * c.menuItem.price}
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <p className="text-slate-600 text-center py-10">Prazno</p>
            )}
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 text-sm">Ukupno:</span>
              <span className="text-2xl font-black text-amber-500 font-mono">
                {cart.reduce(
                  (sum, c) => sum + c.menuItem.price * c.quantity,
                  0,
                )}
              </span>
            </div>
            <button
              onClick={handleOrder}
              disabled={!selectedTable || cart.length === 0}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-20 disabled:grayscale text-slate-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/10"
            >
              POTVRDI PORUDŽBINU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
