"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import type { WCProduct } from "@/types/woocommerce";

interface EditorsChoiceProps {
  products: WCProduct[];
}

export function EditorsChoice({ products }: EditorsChoiceProps) {
  if (!products.length) return null;

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400">
              Seasonal Highlights
            </span>
            <h2 className="mt-4 font-heading text-5xl lg:text-7xl font-bold tracking-tighter leading-none text-neutral-900">
              EDITOR'S <br />
              <span className="italic font-light">CHOICE</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="text-neutral-500 font-light text-base max-w-xs md:text-right leading-relaxed">
              Discover the pieces defining the current season, hand-picked for
              their exceptional quality and design.
            </p>
            <Link
              href="/shop?featured=true"
              className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-neutral-900"
            >
              View the lookbook
              <div className="relative h-10 w-10 rounded-full border border-neutral-200 flex items-center justify-center transition-all group-hover:bg-black group-hover:border-black group-hover:text-white">
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <ProductGrid products={products} columns={4} />
        </div>
      </div>
    </section>
  );
}
