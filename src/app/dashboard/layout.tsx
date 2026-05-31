"use client";

import { useEffect, useState } from "react";
import { getAuthData } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{
    username: string;
    roles: string[];
    isAdmin: boolean;
    isManager: boolean;
    isWaiter: boolean;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = getAuthData();
    if (!data) router.push("/login");
    setUser(data);
  }, []);

  if (!user) return null;

  const getRoleLabel = () => {
    if (!user.isAdmin && !user.isManager && !user.isWaiter) {
      return "ZAPOSLENI";
    }
    let label = "";
    if (user.isAdmin) label += "ADMIN ";
    if (user.isManager) label += "MENADŽER ";
    if (user.isWaiter) label += "KONOBAR";
    return label.trim();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-amber-500 mb-10 tracking-wider text-center">
          RMS PANEL
        </h2>

        <nav className="flex-1 space-y-2">
          {/* SERVISNA SEKCIJA - Pristup imaju svi ulogovani (Authenticated) */}
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2 ml-2">
            Servis
          </p>
          <SidebarLink href="/dashboard/orders" label="Porudžbine" icon="📝" />

          {/* MANAGER SEKCIJA - Upravljanje resursima (Meni i Stolovi) */}
          {user.isManager && (
            <div className="pt-6 mt-6 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2 ml-2">
                Menadžment
              </p>
              <SidebarLink
                href="/dashboard/tables"
                label="Upravljaj stolovima"
                icon="📍"
              />
              <SidebarLink
                href="/dashboard/menu-management"
                label="Upravljaj Menijem"
                icon="🍴"
              />
            </div>
          )}

          {/* ADMIN SEKCIJA - Isključivo upravljanje zaposlenima */}
          {user.isAdmin && (
            <div className="pt-6 mt-6 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2 ml-2">
                Administracija
              </p>
              <SidebarLink
                href="/dashboard/staff"
                label="Zaposleni"
                icon="👥"
              />
            </div>
          )}
        </nav>

        {/* Odjava sa čišćenjem oba tokena */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }}
          className="mt-auto w-full p-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all text-left flex items-center gap-3"
        >
          <span>🚪</span> Odjavi se
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-semibold">
            Dobrodošao, <span className="text-amber-500">{user.username}</span>
          </h1>
          <div className="bg-slate-800 px-4 py-1 rounded-full text-xs font-medium border border-slate-700 text-amber-500">
            {getRoleLabel()}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

const SidebarLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors group"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </Link>
  );
};

export default DashboardLayout;
