"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { ShopFilters } from "./shop-filters";
import type { WCCategory } from "@/types/woocommerce";

interface MobileFiltersProps {
  categories: WCCategory[];
}

export function MobileFilters({ categories }: MobileFiltersProps) {
  const { isFilterOpen, closeFilter } = useUIStore();

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFilter}
            className="fixed inset-0 z-60 bg-black/30 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-70 w-full max-w-xs bg-white p-6 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-light uppercase tracking-widest">
                Filters
              </h2>
              <button
                onClick={closeFilter}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Close filters"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
              <ShopFilters categories={categories} />

              <div className="mt-12 pt-6 border-t border-gray-100">
                <button
                  onClick={closeFilter}
                  className="w-full bg-black py-4 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors"
                >
                  Show Results
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
