"use client";

import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await authService.login({ username, password });

      console.log(data);

      localStorage.setItem("token", data.token);

      window.location.href = "/dashboard/menu-management";
    } catch (err: any) {
      setError(err.response?.data?.message || "Nešto je pošlo po zlu.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl bg-slate-900 p-8 shadow-2xl border border-slate-800"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          RMS Login
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Korisničko ime
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Lozinka
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white focus:border-amber-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-amber-500 py-2.5 font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
        >
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
