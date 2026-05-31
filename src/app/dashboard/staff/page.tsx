"use client";

import { useEffect, useState } from "react";
import { getAuthData } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { usersService } from "@/services/usersService";
import { toast } from "react-hot-toast";
import { User } from "@/types/models/identityModels";
import { RegisterRequest, Role } from "@/types/api";

export default function StaffManagementPage() {
  const router = useRouter();

  // Stanja za podatke
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Stanja za formu registracije
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(["ROLE_WAITER"]);

  useEffect(() => {
    const user = getAuthData();
    if (!user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Greška pri učitavanju zaposlenih.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleCheckboxChange = (role: Role) => {
    if (selectedRoles.includes(role)) {
      // Sprečavamo da ostane bez ijedne uloge
      if (selectedRoles.length === 1) return;
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return toast.error("Sva polja su obavezna!");
    }

    try {
      const payload: RegisterRequest = {
        username,
        password,
        // Konvertujemo niz u Set (ili ga šaljemo direktno ako Axios to serijalizuje,
        // ali pošto JS nema Set u čistom JSON-u, šalje se kao niz koji Spring mapira u Set)
        roles: selectedRoles as unknown as Set<Role>,
      };

      await usersService.register(payload);
      toast.success(`Korisnik ${username} uspešno registrovan.`);

      // Reset forme
      setUsername("");
      setPassword("");
      setSelectedRoles(["ROLE_WAITER"]);

      fetchUsers();
    } catch (error) {
      toast.error("Greška pri registraciji radnika.");
    }
  };

  const handleRemoveUser = async (userId: number, targetUsername: string) => {
    const currentAuth = getAuthData();
    if (currentAuth?.username === targetUsername) {
      return toast.error("Ne možete obrisati samog sebe!");
    }

    if (
      !confirm(
        `Da li ste sigurni da želite da uklonite zaposlenog: ${targetUsername}?`,
      )
    )
      return;

    try {
      await usersService.removeUser(userId);
      toast.success("Zaposleni je uklonjen iz sistema.");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      toast.error("Greška pri uklanjanju zaposlenog.");
    }
  };

  // Pomoćna funkcija za ispis rola u tabeli
  const formatRoles = (user: User) => {
    if (!user.roles) return "NEMA ULOGU";
    if (Array.isArray(user.roles)) {
      return user.roles
        .map((r) => (typeof r === "object" ? r.name : r))
        .join(", ")
        .replace(/ROLE_/g, "");
    }
    return "Neznan status";
  };

  if (loading)
    return (
      <div className="text-slate-400 p-8">Učitavanje liste zaposlenih...</div>
    );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Upravljanje Zaposlenima
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Kreiranje naloga i dodela privilegija za osoblje
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEVA STRANA: Registracija novog radnika */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
          <h3 className="text-lg font-bold mb-6 text-amber-500">
            Registruj zaposlenog
          </h3>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs text-slate-500 uppercase font-bold mb-2 ml-1">
                Korisničko ime
              </label>
              <input
                type="text"
                placeholder="npr. jovan_konobar"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase font-bold mb-2 ml-1">
                Lozinka
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase font-bold mb-3 ml-1">
                Uloge (Privilegije)
              </label>
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {(["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_WAITER"] as Role[]).map(
                  (role) => (
                    <label
                      key={role}
                      className="flex items-center gap-3 cursor-pointer group text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleCheckboxChange(role)}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500/20 accent-amber-500"
                      />
                      <span
                        className={`transition-colors ${selectedRoles.includes(role) ? "text-white font-medium" : "text-slate-500 group-hover:text-slate-300"}`}
                      >
                        {role.replace("ROLE_", "")}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/5"
            >
              KREIRAJ NALOG
            </button>
          </form>
        </div>

        {/* DESNA STRANA: Tabela trenutno zaposlenih */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-4">Korisnik</th>
                <th className="p-4">Dodeljene Uloge</th>
                <th className="p-4 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-800/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-100">
                        {user.username}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md text-amber-400 font-mono font-medium">
                      {formatRoles(user)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRemoveUser(user.id, user.username)}
                      className="text-slate-500 hover:text-red-500 transition-colors px-2 py-1 text-sm"
                      title="Ukloni zaposlenog"
                    >
                      🗑️ Obrisi
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-8 text-slate-500 italic"
                  >
                    Nema registrovanih radnika.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
