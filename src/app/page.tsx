import Link from "next/link";
import Image from "next/image";
import { wooCommerce } from "@/lib/woocommerce";
import { ProductGrid } from "@/components/product/product-grid";
import { HeroSection } from "@/components/home/hero-section";
import { Button } from "@/components/ui/button";
import { LatestArrivals } from "@/components/home/latest-arrivals";
import type { WCCategory } from "@/types/woocommerce";

// Define which category slugs to show on homepage
const FEATURED_CATEGORY_SLUGS = ["women", "men", "accessories"];

export default async function HomePage() {
  // Fetch featured/new products and categories
  let featuredProducts: Awaited<ReturnType<typeof wooCommerce.products.list>> =
    [];
  let newProducts: Awaited<ReturnType<typeof wooCommerce.products.list>> = [];
  let categories: WCCategory[] = [];

  try {
    [featuredProducts, newProducts, categories] = await Promise.all([
      wooCommerce.products.list({ featured: true, per_page: 4 }),
      wooCommerce.products.list({
        orderby: "date",
        order: "desc",
        per_page: 8,
      }),
      wooCommerce.categories.list({ per_page: 100, hide_empty: false }),
    ]);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  // Filter and order categories based on FEATURED_CATEGORY_SLUGS
  const featuredCategories = FEATURED_CATEGORY_SLUGS.map((slug) =>
    categories.find((cat) => cat.slug === slug),
  ).filter((cat): cat is WCCategory => cat !== undefined);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products - Clean Grid */}
      {featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-end justify-between mb-12 border-b border-gray-200 pb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Pick of the week
                </span>
                <h2 className="mt-2 font-heading text-3xl font-normal">
                  Editor's Choice
                </h2>
              </div>
              <Link
                href="/shop?featured=true"
                className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              >
                View All
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
            <ProductGrid products={featuredProducts} columns={4} />
          </div>
        </section>
      )}

      {/* Promotional Video/Large Banner Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"
          alt="Campaign"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <span className="text-sm font-bold uppercase tracking-[0.3em]">
            Spring Summer 2026
          </span>
          <h2 className="mt-6 font-heading text-5xl md:text-7xl font-light">
            The Nomad Collection
          </h2>
          <p className="mt-6 max-w-lg text-lg text-gray-200 font-light">
            Ethereal fabrics and earthy tones designed for the modern wanderer.
            Discover the essence of slow living.
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-none px-10 bg-white text-black hover:bg-gray-100 uppercase tracking-widest text-xs font-bold"
              >
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="rounded-none px-10 border-white text-white hover:bg-white/10 uppercase tracking-widest text-xs font-bold"
              >
                Our Vision
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals with Filtering */}
      {newProducts.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <LatestArrivals products={newProducts as any} />
          </div>
        </section>
      )}

      {/* Instagram Feed Style Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl">@Minimalist_Living</h2>
            <p className="mt-2 text-gray-500 italic">
              Follow us on Instagram for daily inspiration
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden bg-gray-100"
              >
                <Image
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=crop&q=60&w=300`}
                  alt="Social feed"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                text: "The quality of the fabrics is beyond incredible. Every piece I've bought feels timeless and well-crafted.",
                author: "Sarah J.",
                role: "Verified Customer",
              },
              {
                text: "Minimalist aesthetic done right. Their shipping is surprisingly fast and the packaging is beautiful.",
                author: "Michael R.",
                role: "Verified Customer",
              },
              {
                text: "Finally found a brand that balances style and sustainability. The fit is perfect every single time.",
                author: "Elena W.",
                role: "Verified Customer",
              },
            ].map((testimonial, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, star) => (
                    <svg
                      key={star}
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-xl font-light italic text-gray-800 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                <div className="mt-6">
                  <p className="font-bold text-sm tracking-widest uppercase">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black py-24 text-white">
        <div className="mx-auto max-w-xl px-4 text-center lg:px-8">
          <h2 className="font-heading text-3xl font-light tracking-tight md:text-5xl">
            Join the Club
          </h2>
          <p className="mt-4 text-gray-400 font-light">
            Stay updated with our latest releases, exclusive offers, and styling
            tips. Get <span className="text-white font-bold">10% OFF</span> on
            your first order.
          </p>
          <form className="mt-10 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 px-6 py-4 text-sm focus:outline-none focus:border-white transition-colors"
              required
            />
            <button className="bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest">
            By subscribing you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </section>
    </div>
  );
}
