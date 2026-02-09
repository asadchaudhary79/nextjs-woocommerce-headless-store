import { Suspense } from "react";
import { wooCommerce } from "@/lib/woocommerce";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ShopFilters } from "@/components/shop/shop-filters";
import { MobileFilters } from "@/components/shop/mobile-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse our complete collection of fashion items.",
};

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
    featured?: string;
    on_sale?: string;
    search?: string;
    columns?: string;
  }>;
}

async function ProductList({
  searchParams,
}: {
  searchParams: ShopPageProps["searchParams"];
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const columns = parseInt(params.columns || "4") as 2 | 3 | 4;
  const perPage = 12;

  const products = await wooCommerce.products.list({
    page,
    per_page: perPage,
    orderby: params.orderby as "date" | "price" | "popularity" | undefined,
    order: params.order as "asc" | "desc" | undefined,
    featured: params.featured === "true" ? true : undefined,
    on_sale: params.on_sale === "true" ? true : undefined,
    search: params.search,
  });

  if (products.length === 0) {
    return (
      <div className="py-12 text-center border-t border-gray-100">
        <p className="text-gray-500 italic">
          No products were found matching your selection.
        </p>
      </div>
    );
  }

  return (
    <>
      <ProductGrid products={products} columns={columns} />

      {/* Pagination placeholder */}
      {products.length === perPage && (
        <div className="mt-16 flex justify-center border-t border-gray-100 pt-12">
          <a
            href={`/shop?page=${page + 1}`}
            className="group relative overflow-hidden border border-black px-12 py-4 text-xs font-bold uppercase tracking-widest transition-all hover:text-white"
          >
            <span className="relative z-10">Load More</span>
            <div className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-300 group-hover:translate-y-0" />
          </a>
        </div>
      )}
    </>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categories = await wooCommerce.categories.list({ per_page: 20 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light">Shop All</h1>
        {params.search && (
          <p className="mt-2 text-gray-500">
            Search results for &quot;{params.search}&quot;
          </p>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ShopFilters categories={categories} />
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        <MobileFilters categories={categories} />

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <ShopToolbar />

          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <ProductList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
