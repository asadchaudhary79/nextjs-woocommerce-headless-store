import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wooCommerce } from "@/lib/woocommerce";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ShopFilters } from "@/components/shop/shop-filters";
import { MobileFilters } from "@/components/shop/mobile-filters";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
    columns?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await wooCommerce.categories.getBySlug(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description:
      category.description || `Shop our ${category.name} collection.`,
  };
}

async function CategoryProducts({
  categoryId,
  searchParams,
}: {
  categoryId: number;
  searchParams: CategoryPageProps["searchParams"];
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const columns = parseInt(params.columns || "4") as 2 | 3 | 4;
  const perPage = 12;

  const products = await wooCommerce.products.list({
    category: String(categoryId),
    page,
    per_page: perPage,
    orderby: params.orderby as "date" | "price" | "popularity" | undefined,
    order: params.order as "asc" | "desc" | undefined,
  });

  if (products.length === 0) {
    return (
      <div className="py-24 text-center border-t border-neutral-100">
        <p className="text-neutral-400 italic">
          No products were found in this collection.
        </p>
      </div>
    );
  }

  return (
    <>
      <ProductGrid products={products} columns={columns} />

      {products.length === perPage && (
        <div className="mt-16 flex justify-center border-t border-neutral-100 pt-12">
          <a
            href={`?page=${page + 1}`}
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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = await wooCommerce.categories.getBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const allCategories = await wooCommerce.categories.list({ per_page: 20 });

  return (
    <div className="bg-white min-h-screen">
      {/* Category Header */}
      <header className="relative py-24 lg:py-32 bg-neutral-50 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] border border-black rounded-full" />
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
              <Link href="/shop" className="hover:text-black transition-colors">
                Shop
              </Link>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-black">{category.name}</span>
            </nav>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
              {category.name}
            </h1>
            {category.description && (
              <div
                className="max-w-xl text-lg text-neutral-500 font-light leading-relaxed prose prose-neutral prose-sm"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            )}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-100 rounded-full shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {category.count} items available
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <ShopFilters categories={allCategories} />
            </div>
          </aside>

          {/* Table-side / Mobile Filters */}
          <MobileFilters categories={allCategories} />

          {/* Products Grid */}
          <div className="lg:col-span-9">
            <ShopToolbar />

            <Suspense fallback={<ProductGridSkeleton count={12} />}>
              <CategoryProducts
                categoryId={category.id}
                searchParams={searchParams}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
