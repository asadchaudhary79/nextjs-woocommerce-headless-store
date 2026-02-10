"use client";

import type { WCCategory } from "@/types/woocommerce";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
  categories: WCCategory[];
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-16 py-4">
      {/* Categories */}
      <div className="animate-fadeIn">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-8 flex items-center gap-3">
          Collections
          <span className="h-px flex-1 bg-neutral-100" />
        </h3>
        <ul className="space-y-5">
          <li>
            <Link
              href="/shop"
              className={cn(
                "group flex items-center justify-between text-sm transition-all duration-300",
                pathname === "/shop"
                  ? "text-black font-black"
                  : "text-neutral-500 hover:text-black font-bold",
              )}
            >
              <span className="relative">
                All Products
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-black transition-all duration-500",
                    pathname === "/shop" ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </span>
            </Link>
          </li>
          {categories.map((category) => {
            const isActive = pathname === `/shop/${category.slug}`;
            return (
              <li key={category.id}>
                <Link
                  href={`/shop/${category.slug}`}
                  className={cn(
                    "group flex items-center justify-between text-sm transition-all duration-300",
                    isActive
                      ? "text-black font-black"
                      : "text-neutral-500 hover:text-black font-bold",
                  )}
                >
                  <span className="relative">
                    {category.name}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-px bg-black transition-all duration-500",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </span>
                  <span className="text-[9px] text-neutral-300 font-bold group-hover:text-neutral-400 transition-colors bg-neutral-50 px-2.5 py-1 rounded-full">
                    {category.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Range */}
      <div className="animate-fadeIn delay-100">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-8 flex items-center gap-3">
          Price Range
          <span className="h-px flex-1 bg-neutral-100" />
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: "Under $100", range: [0, 100] },
            { label: "$100 - $500", range: [100, 500] },
            { label: "Over $500", range: [500, 0] },
          ].map((btn) => (
            <button
              key={btn.label}
              className="group flex items-center justify-between px-5 py-4 border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
            >
              {btn.label}
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-white transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="animate-fadeIn delay-200">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-8 flex items-center gap-3">
          Sort By
          <span className="h-px flex-1 bg-neutral-100" />
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Newest", "Popularity", "Price: -Low", "Price: -High"].map(
            (label) => (
              <button
                key={label}
                className="px-5 py-3 bg-neutral-50 border border-transparent text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 rounded-full"
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
