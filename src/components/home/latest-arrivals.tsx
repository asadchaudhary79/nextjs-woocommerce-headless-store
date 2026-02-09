"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import type { WCProduct } from "@/types/woocommerce";

interface LatestArrivalsProps {
  products: WCProduct[];
}

export function LatestArrivals({ products }: LatestArrivalsProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "all") return true;
    return product.categories.some(
      (cat) => cat.slug.toLowerCase() === activeFilter.toLowerCase(),
    );
  });

  const filters = [
    { name: "All Products", slug: "all" },
    { name: "Clothing", slug: "clothing" },
    { name: "Decor", slug: "decor" },
    { name: "Accessories", slug: "accessories" },
    { name: "New In", slug: "new" },
  ];

  return (
    <section className=" bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            Latest Arrivals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our newest collection of premium essentials
          </p>
        </div>

        {/* Simplified Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.slug}
              onClick={() => setActiveFilter(filter.slug)}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                activeFilter === filter.slug
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="min-h-[500px]">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={4} />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-500">
                No products found in this category.
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 text-sm font-medium text-gray-900 hover:text-black"
              >
                View all products →
              </button>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => setActiveFilter("all")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-black transition-colors duration-300 group"
          >
            <span className="font-medium">View All Products</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
