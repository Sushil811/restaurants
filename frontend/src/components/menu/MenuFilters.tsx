'use client';

import { ArrowUpDown, Leaf, Wheat, Filter } from 'lucide-react';
import type { Category, SortOption } from './MenuPageClient';

interface MenuFiltersProps {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
  vegFilter: boolean;
  onVegToggle: () => void;
  veganFilter: boolean;
  onVeganToggle: () => void;
  glutenFreeFilter: boolean;
  onGlutenFreeToggle: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

interface ToggleProps {
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  colorClass: string;
}

function ToggleFilter({ label, icon, checked, onChange, colorClass }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
        checked
          ? `${colorClass} border-current`
          : 'bg-white dark:bg-[#1a1a1a] text-[#4a4a4a] dark:text-[#c8b99a] border-[#e8e0d0] dark:border-[#2e2a22] hover:border-[#c9a84c]'
      }`}
    >
      {icon}
      {label}
      <div
        className={`ml-auto w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
          checked ? 'bg-current' : 'bg-[#e8e0d0] dark:bg-[#3a3a3a]'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function MenuFilters({
  vegFilter,
  onVegToggle,
  veganFilter,
  onVeganToggle,
  glutenFreeFilter,
  onGlutenFreeToggle,
  sortBy,
  onSortChange,
}: MenuFiltersProps) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-[#e8e0d0] dark:border-[#2e2a22] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-[#c9a84c]" />
        <h3 className="font-semibold text-sm text-[#0d0d0d] dark:text-[#f5ecd7]">Filter & Sort</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dietary Filters */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#7a7a7a] uppercase tracking-wider mb-3">Dietary</p>
          <ToggleFilter
            label="Vegetarian"
            icon={<div className="w-4 h-4 rounded border-2 border-green-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-500" /></div>}
            checked={vegFilter}
            onChange={onVegToggle}
            colorClass="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
          />
          <ToggleFilter
            label="Vegan"
            icon={<Leaf className="w-4 h-4" />}
            checked={veganFilter}
            onChange={onVeganToggle}
            colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
          />
          <ToggleFilter
            label="Gluten-Free"
            icon={<Wheat className="w-4 h-4" />}
            checked={glutenFreeFilter}
            onChange={onGlutenFreeToggle}
            colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
          />
        </div>

        {/* Sort Options */}
        <div className="sm:col-span-1 lg:col-span-2">
          <div className="flex items-center gap-1.5 mb-3">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7a7a7a]" />
            <p className="text-xs font-semibold text-[#7a7a7a] uppercase tracking-wider">Sort By</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  sortBy === opt.value
                    ? 'bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white shadow-md'
                    : 'bg-[#f9f6f0] dark:bg-[#0d0d0d] text-[#4a4a4a] dark:text-[#c8b99a] hover:border-[#c9a84c] hover:text-[#c9a84c] border border-transparent hover:border-[#c9a84c]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Info */}
        <div>
          <p className="text-xs font-semibold text-[#7a7a7a] uppercase tracking-wider mb-3">Price Range</p>
          <div className="p-3 rounded-xl bg-[#f9f6f0] dark:bg-[#0d0d0d] border border-[#e8e0d0] dark:border-[#2e2a22]">
            <div className="flex justify-between text-xs text-[#7a7a7a] mb-2">
              <span>₹280</span>
              <span>₹4,500</span>
            </div>
            <div className="h-1.5 bg-[#e8e0d0] dark:bg-[#3a3a3a] rounded-full">
              <div className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] rounded-full w-full" />
            </div>
            <p className="text-[10px] text-[#7a7a7a] mt-2 text-center">All prices (use sort to order)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
