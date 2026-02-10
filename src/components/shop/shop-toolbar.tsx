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
    <div className="mb-12 flex items-center justify-between border-b border-neutral-100 pb-6">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleFilter}
        className="flex lg:hidden items-center gap-3 px-6 py-3 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-6.75 0H7.5m.901-6h11.10a1.5 1.5 0 110 3H8.401m0 0a1.5 1.5 0 100-3m-4.651 0H7.5"
          />
        </svg>
        Filter
      </button>

      {/* Desktop Info */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <p className="text-[11px] text-neutral-400 uppercase tracking-[0.3em] font-bold">
            Showing results
          </p>
        </div>
      </div>

      {/* View & Sort */}
      <div className="flex items-center gap-8">
        {/* Column Selectors */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300">
            Layout
          </span>
          <div className="flex items-center bg-neutral-50 rounded-full p-1 border border-neutral-100">
            {[2, 3, 4].map((cols) => (
              <button
                key={cols}
                onClick={() => updateColumns(cols)}
                className={cn(
                  "flex h-8 w-10 items-center justify-center rounded-full transition-all duration-300",
                  currentColumns === cols
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-400 hover:text-neutral-600",
                )}
                aria-label={`View ${cols} columns`}
              >
                <div className="flex gap-[1.5px]">
                  {Array.from({ length: cols }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-3 w-[1.5px] bg-current rounded-full transition-opacity duration-300",
                        currentColumns === cols ? "opacity-100" : "opacity-30",
                      )}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
