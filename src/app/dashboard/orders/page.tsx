"use client";

import { useEffect, useState } from "react";
import { ordersService } from "@/services/ordersService";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Order } from "@/types/models/restaurantModels";
import NewOrderModal from "@/components/orders/NewOrderModal";

const OrdersManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const fetchOrders = async () => {
    try {
      const data = await ordersService.getPendingOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Greška pri učitavanju porudžbina");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Automatsko osvežavanje na svakih 45 sekundi
    const interval = setInterval(fetchOrders, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (id: number) => {
    try {
      await ordersService.completeOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Porudžbina uspešno naplaćena");
    } catch (error) {
      toast.error("Greška pri zatvaranju porudžbine");
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da OTKAŽETE porudžbinu?")) return;
    try {
      await ordersService.cancelOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.error("Porudžbina otkazana");
    } catch (error) {
      toast.error("Greška pri otkazivanju");
    }
  };

  // Filtriranje po broju stola ili imenu konobara
  const filteredOrders = orders.filter(
    (o) =>
      o.table.tableNumber.toString().includes(filter) ||
      o.waiterUsername.toLowerCase().includes(filter.toLowerCase()),
  );

  if (loading)
    return (
      <div className="text-slate-400 p-8">Sinhronizacija sa kuhinjom...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Aktivne Porudžbine</h2>
          <p className="text-slate-500 text-sm">
            Pregled i upravljanje otvorenim stolovima
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Pretraži (Sto / Konobar)..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:border-amber-500 outline-none w-full"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition-all"
          >
            + Nova Porudžbina
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500 italic">
              Nema aktivnih porudžbina koje odgovaraju pretrazi.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col hover:border-slate-700 transition-all shadow-xl"
            >
              {/* Header Porudžbine */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-xs text-amber-500/60 uppercase font-bold">
                      Sto
                    </span>
                    <span className="text-2xl font-black text-amber-500 leading-none">
                      {order.table.tableNumber}
                    </span>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      {order.waiterUsername}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase">Iznos</div>
                  <div className="text-xl font-mono font-bold text-white">
                    {order.totalPrice.toLocaleString()} RSD
                  </div>
                </div>
              </div>

              {/* Lista stavki */}
              <div className="flex-1 space-y-2 mb-6 bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      <span className="text-amber-500/50 font-bold mr-2">
                        {item.quantity}x
                      </span>
                      {item.menuItem.name}
                    </span>
                    <span className="text-slate-500">
                      {(item.menuItem.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dugmići za akciju */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleCancel(order.id)}
                  className="flex-1 py-3 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                >
                  OTKAŽI
                </button>
                <button
                  onClick={() => handleComplete(order.id)}
                  className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                >
                  ZAVRŠI I NAPLATI
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <NewOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrders} // Automatski osvežava listu nakon slanja
      />
    </div>
  );
};

export default OrdersManagementPage;
