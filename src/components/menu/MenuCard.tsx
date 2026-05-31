import { MenuItem } from "@/types/models/restaurantModels";
import React from "react";

const MenuCard = ({ item }: { item: MenuItem }) => {
  return (
    <div className="group bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-amber-500/30 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.05)]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-slate-100 group-hover:text-amber-500 transition-colors">
          {item.name}
        </h3>
        <span className="text-amber-500 font-bold text-lg">
          {item.price.toLocaleString()} RSD
        </span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        {item.description || "Nema opisa za ovo jelo."}
      </p>
      <div className="flex items-center gap-2">
        {!item.available && (
          <span className="text-[10px] uppercase tracking-wider bg-red-500/10 text-red-500 px-2 py-1 rounded">
            Trenutno nedostupno
          </span>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
