import { Suspense } from "react";
import Link from "next/link";
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
    <div className="bg-white">
      {/* Editorial Header */}
      <header className="relative py-24 lg:py-32 bg-neutral-50 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[120%] border-r border-black rotate-12" />
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[120%] border-l border-black -rotate-12" />
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-black">Shop All</span>
            </nav>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
              The <span className="italic font-light">Archive</span>
            </h1>
            <p className="max-w-xl text-lg text-neutral-500 font-light leading-relaxed">
              Explore our complete collection of meticulously crafted
              essentials, designed for the modern individual.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <ShopFilters categories={categories} />
            </div>
          </aside>

          {/* Table-side / Mobile Filters */}
          <MobileFilters categories={categories} />

          {/* Products Grid */}
          <div className="lg:col-span-9">
            <ShopToolbar />

            <Suspense fallback={<ProductGridSkeleton count={12} />}>
              <ProductList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
