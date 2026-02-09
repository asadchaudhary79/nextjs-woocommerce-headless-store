"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function ShopToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toggleFilter } = useUIStore();

  const currentColumns = parseInt(searchParams.get("columns") || "4");

  const updateColumns = (cols: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("columns", cols.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleFilter}
        className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider lg:hidden"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-6.75 0H7.5m.901-6h11.10a1.5 1.5 0 110 3H8.401m0 0a1.5 1.5 0 100-3m-4.651 0H7.5"
          />
        </svg>
        Filters
      </button>

      {/* Desktop Info */}
      <div className="hidden lg:block">
        <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">
          Refined Selection
        </p>
      </div>

      {/* Column Selectors */}
      <div className="flex items-center gap-4">
        <span className="hidden text-xs font-medium uppercase tracking-widest text-gray-400 sm:block">
          View
        </span>
        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
          {[2, 3, 4].map((cols) => (
            <button
              key={cols}
              onClick={() => updateColumns(cols)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                currentColumns === cols
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              )}
              aria-label={`View ${cols} columns`}
            >
              <div className="flex gap-[2px]">
                {Array.from({ length: cols }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-3 w-[2px] bg-current rounded-full",
                      currentColumns === cols ? "opacity-100" : "opacity-60",
                    )}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
