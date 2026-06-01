"use client";

import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  // Novi state koji kontroliše koju formu prikazujemo
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const data = await authService.login({ username, password });

      // Odmah čuvamo token jer nam treba za change-password ili dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      if (data.firstLogin) {
        setIsFirstLogin(true);
        toast.success("Prva prijava. Obavezna promena lozinke.");
      } else {
        window.location.href = "/dashboard/menu-management";
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Neispravni podaci.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await authService.changePassword({ newPassword });
      toast.success("Lozinka uspešno promenjena! Prijavite se ponovo.");

      // Resetujemo sve i vraćamo na login
      localStorage.removeItem("token");
      setIsFirstLogin(false);
      setPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Greška pri promeni lozinke.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
        {/* DINAMIČKI NASLOV */}
        <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tight">
          {isFirstLogin ? "NOVA LOZINKA" : "RMS LOGIN"}
        </h2>
        <p className="text-slate-500 text-sm text-center mb-8 italic">
          {isFirstLogin
            ? "Postavite vašu trajnu lozinku"
            : "Restoran Management System"}
        </p>

        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center font-medium">
            {error}
          </div>
        )}

        {!isFirstLogin ? (
          /* LOGIN FORMA */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Korisničko ime
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition-all"
                placeholder="Unesite username"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Trenutna lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-4 font-black text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 mt-2"
            >
              PRISTUPI SISTEMU
            </button>
          </form>
        ) : (
          /* FORMA ZA PROMENU LOZINKE */
          <form
            onSubmit={handleChangePassword}
            className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Nova lozinka
              </label>
              <input
                type="password"
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-500 px-1">
              * Nakon promene lozinke biće potrebno da se ponovo prijavite radi
              bezbednosti.
            </p>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-4 font-black text-white hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
            >
              SAČUVAJ I NASTAVI
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
