import { Category } from "@/types/models/restaurantModels";

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

const CategoryFilter = ({ categories, selectedId, onSelect }: Props) => {
  return (
    <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide sticky top-0 bg-slate-950 z-10 py-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-6 py-2 rounded-full whitespace-nowrap transition-all border ${
          selectedId === null
            ? "bg-amber-500 border-amber-500 text-slate-950 font-bold"
            : "border-slate-800 text-slate-400 hover:border-amber-500/50"
        }`}
      >
        Sve
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-6 py-2 rounded-full whitespace-nowrap transition-all border ${
            selectedId === cat.id
              ? "bg-amber-500 border-amber-500 text-slate-950 font-bold"
              : "border-slate-800 text-slate-400 hover:border-amber-500/50"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
