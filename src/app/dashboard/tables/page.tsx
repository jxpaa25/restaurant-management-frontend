"use client";

import { useEffect, useState } from "react";
import { getAuthData } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { restaurantTableService } from "@/services/restaurantTableService";
import { toast } from "react-hot-toast";
import { RestaurantTable } from "@/types/models/restaurantModels";

const TablesManagementPage = () => {
  const router = useRouter();

  // State za podatke i učitavanje
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);

  // State za formu unosa novog stola
  const [newTableNumber, setNewTableNumber] = useState<number | "">("");

  useEffect(() => {
    const user = getAuthData();
    if (!user?.isManager) {
      router.push("/dashboard");
      return;
    }
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await restaurantTableService.getAllTables();
      // Sortiramo stolove po broju kako bi pregled bio hronološki
      const sortedTables = data.sort((a, b) => a.tableNumber - b.tableNumber);
      setTables(sortedTables);
    } catch (error) {
      toast.error("Greška pri učitavanju stolova.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber || newTableNumber <= 0) {
      return toast.error("Unesite validan broj stola!");
    }

    // Provera da li sto sa tim brojem već postoji na klijentu pre slanja zahteva
    const exists = tables.some((t) => t.tableNumber === Number(newTableNumber));
    if (exists) {
      return toast.error(`Sto sa brojem ${newTableNumber} već postoji!`);
    }

    try {
      await restaurantTableService.createNewTable(Number(newTableNumber));
      toast.success(`Sto broj ${newTableNumber} je uspešno dodat.`);
      setNewTableNumber("");
      fetchTables();
    } catch (error) {
      toast.error("Greška pri kreiranju stola. Moguće je da broj već postoji.");
    }
  };

  const handleRemoveTable = async (tableId: number, tableNumber: number) => {
    if (
      !confirm(
        `Da li ste sigurni da želite da obrišete sto broj ${tableNumber}?`,
      )
    )
      return;

    try {
      await restaurantTableService.removeTable(tableId);
      toast.success(`Sto broj ${tableNumber} je uklonjen.`);
      // Brzi klijentski filter da ne moramo ponovo da radimo fetch
      setTables(tables.filter((t) => t.id !== tableId));
    } catch (error) {
      toast.error(
        "Nije moguće obrisati sto. Proverite da li ima aktivne porudžbine.",
      );
    }
  };

  if (loading)
    return (
      <div className="text-slate-400 p-8">Učitavanje rasporeda stolova...</div>
    );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-white">Upravljanje Stolovima</h2>
        <p className="text-slate-500 text-sm mt-1">
          Konfiguracija i pregled kapaciteta restorana
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEVA STRANA: Forma za dodavanje stola */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
          <h3 className="text-lg font-bold mb-6 text-amber-500">
            Dodaj novi sto
          </h3>
          <form onSubmit={handleCreateTable} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase font-bold mb-2 ml-1">
                Broj Stola
              </label>
              <input
                type="number"
                min="1"
                placeholder="Npr. 12"
                value={newTableNumber}
                onChange={(e) =>
                  setNewTableNumber(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/5"
            >
              DODAJ STO
            </button>
          </form>
        </div>

        {/* DESNA STRANA: Grid vizuelni prikaz stolova */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Trenutni raspored ({tables.length} ukupno)
          </h3>

          {tables.length === 0 ? (
            <div className="text-center py-12 text-slate-500 italic">
              Nema registrovanih stolova u sistemu.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables.map((table) => {
                const isOccupied = table.status === "OCCUPIED";
                return (
                  <div
                    key={table.id}
                    className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between group transition-all hover:border-slate-700 hover:shadow-xl"
                  >
                    {/* Dugme za brisanje stola u gornjem desnom uglu na hover */}
                    <button
                      onClick={() =>
                        handleRemoveTable(table.id, table.tableNumber)
                      }
                      className="absolute top-3 right-3 text-slate-600 hover:text-red-500 transition-colors text-xs opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Ukloni sto"
                    >
                      🗑️
                    </button>

                    {/* Glavni bedž sa brojem stola */}
                    <div
                      className={`w-14 h-14 rounded-full border flex items-center justify-center font-mono text-xl font-black mb-4 transition-all ${
                        isOccupied
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {table.tableNumber}
                    </div>

                    {/* Indikator statusa */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isOccupied
                          ? "bg-red-500/10 text-red-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {isOccupied ? "Zauzet" : "Slobodan"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablesManagementPage;
