import type { WCCategory } from "@/types/woocommerce";
import Link from "next/link";

interface ShopFiltersProps {
  categories: WCCategory[];
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-gray-900">
          Categories
        </h3>
        <ul className="mt-4 space-y-3">
          <li>
            <Link
              href="/shop"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              All Products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/shop/${category.slug}`}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                {category.name}{" "}
                <span className="text-gray-300 ml-1">({category.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-gray-900">
          Sort By
        </h3>
        <ul className="mt-4 space-y-3">
          <li>
            <Link
              href="/shop?orderby=date&order=desc"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Newest
            </Link>
          </li>
          <li>
            <Link
              href="/shop?orderby=price&order=asc"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Price: Low to High
            </Link>
          </li>
          <li>
            <Link
              href="/shop?orderby=price&order=desc"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Price: High to Low
            </Link>
          </li>
          <li>
            <Link
              href="/shop?orderby=popularity"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Popularity
            </Link>
          </li>
        </ul>
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-gray-900">
          Refine
        </h3>
        <ul className="mt-4 space-y-3">
          <li>
            <Link
              href="/shop?on_sale=true"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              On Sale
            </Link>
          </li>
          <li>
            <Link
              href="/shop?featured=true"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Featured Items
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
