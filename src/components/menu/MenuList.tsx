import { MenuItem } from "@/types/models/restaurantModels";
import React from "react";
import MenuCard from "./MenuCard";

interface Props {
  items: MenuItem[];
}

const MenuList = ({ items }: Props) => {
  // Ako je kategorija prazna
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
          <svg
            className="w-8 h-8 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="X9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-slate-300">
          Nema dostupnih stavki
        </h3>
        <p className="text-slate-500 mt-1">
          Trenutno nema jela u ovoj kategoriji.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuList;
