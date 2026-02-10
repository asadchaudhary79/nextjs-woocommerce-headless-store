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
    <div className="animate-fadeIn space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Brand Story - Editorial Asymmetry */}
      <section className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl z-10">
                <Image
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2070"
                  alt="Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square rounded-[2rem] bg-neutral-50 -z-0 border border-neutral-100 hidden lg:block" />
              <div className="absolute top-10 -left-10 p-8 bg-black text-white rounded-2xl z-20 hidden lg:flex flex-col gap-2 shadow-xl">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
                  Certification
                </span>
                <span className="text-xl font-bold italic">100% Organic</span>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400">
                  Our Philosophy
                </span>
                <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-neutral-900">
                  DESIGNED WITH <br />
                  <span className="italic font-light">PURPOSE</span>
                </h2>
              </div>
              <p className="text-lg text-neutral-500 font-light leading-relaxed max-w-lg">
                We believe in garments that tell a story. Not just the story of
                the wearer, but of the hands that crafted them, the soil that
                grew the fibers, and the vision that brought it all together.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm tracking-widest uppercase">
                    Ethics First
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed font-light">
                    Sourced from certified fair-trade partners globally.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm tracking-widest uppercase">
                    Pure Quality
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed font-light">
                    Natural fibers designed to last for generations.
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-900 mt-4"
              >
                Learn our story
                <span className="h-[1px] w-12 bg-black transition-all duration-500 group-hover:w-20" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collections - Cinematic Tiles */}
      <section className="py-24 bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-500">
                The Vault
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter uppercase italic">
                Curated Edits
              </h2>
            </div>
            <p className="text-neutral-400 font-light max-w-sm text-sm">
              Explore our specialized collections for every occasion and season.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              href="/shop/women"
              className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
                alt="Women"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-bold tracking-tight uppercase">
                  Female Edit
                </h3>
                <p className="text-xs font-bold tracking-[0.3em] uppercase mt-2 opacity-60">
                  Shop collection
                </p>
              </div>
            </Link>

            <Link
              href="/shop/men"
              className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden lg:mt-12"
            >
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040"
                alt="Men"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-bold tracking-tight uppercase">
                  Modern Masculine
                </h3>
                <p className="text-xs font-bold tracking-[0.3em] uppercase mt-2 opacity-60">
                  Shop collection
                </p>
              </div>
            </Link>

            <Link
              href="/shop/accessories"
              className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099"
                alt="Accessories"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-3xl font-bold tracking-tight uppercase">
                  Essentials
                </h3>
                <p className="text-xs font-bold tracking-[0.3em] uppercase mt-2 opacity-60">
                  Shop collection
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Grid */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-24 border-b">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-end justify-between mb-12 border-b border-neutral-100 pb-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                  Pick of the week
                </span>
                <h2 className="mt-2 font-heading text-4xl font-bold tracking-tight">
                  Editor's Choice
                </h2>
              </div>
              <Link
                href="/shop?featured=true"
                className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest"
              >
                View full list
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
      <section className="relative h-[80vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"
          alt="Campaign"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <span className="text-xs font-bold uppercase tracking-[0.5em] mb-6 block">
            Spring Summer 2026
          </span>
          <h2 className="text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter leading-none">
            NOMAD <br /> <span className="italic font-light">COLLECTION</span>
          </h2>
          <p className="mt-10 max-w-lg text-lg text-neutral-300 font-light leading-relaxed">
            Ethereal fabrics and earthy tones designed for the modern wanderer.
            Discover the essence of slow living.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-none h-16 px-12 bg-white text-black hover:bg-neutral-100 uppercase tracking-widest text-xs font-bold"
              >
                Explore Edition
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="rounded-none h-16 px-12 border-white text-white hover:bg-white/10 uppercase tracking-widest text-xs font-bold"
              >
                Visual Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals with Filtering */}
      {newProducts.length > 0 && (
        <section className="py-24 bg-white border-b border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <LatestArrivals products={newProducts as any} />
          </div>
        </section>
      )}

      {/* Instagram Feed Style Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-neutral-100 pb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                Social Gallery
              </span>
              <h2 className="text-4xl font-bold tracking-tight mt-2">
                @Minimalist_Living
              </h2>
            </div>
            <p className="text-neutral-500 font-light max-w-xs text-sm italic">
              Join our community of over 200,000 tastemakers sharing their daily
              inspiration.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden bg-neutral-100 rounded-3xl"
              >
                <Image
                  src={`https://images.unsplash.com/photo-${1515000000000 + i * 110000}?auto=format&fit=crop&q=60&w=400`}
                  alt="Social feed"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-white"
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
      <section className="bg-neutral-50 py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-24 text-[200px] font-black text-black/[0.02] select-none pointer-events-none leading-none">
          REVIEWS
        </div>
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-3">
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
              <div
                key={i}
                className="flex flex-col gap-8 bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-neutral-100"
              >
                <div className="flex gap-1 text-black">
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
                <blockquote className="text-xl font-light italic text-neutral-800 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden relative">
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      alt={testimonial.author}
                      fill
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs tracking-widest uppercase">
                      {testimonial.author}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-tighter">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neutral-800 rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-xl px-4 text-center lg:px-8 relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] mb-8 block opacity-50">
            Private List
          </span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
            JOIN THE <span className="italic font-light">CLUB</span>
          </h2>
          <p className="mt-8 text-neutral-400 font-light text-lg leading-relaxed">
            Stay updated with our latest releases, exclusive offers, and styling
            tips. Get <span className="text-white font-bold">10% OFF</span> on
            your first order.
          </p>
          <form className="mt-12 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/5 border border-white/10 px-8 py-5 text-sm rounded-full focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
              required
            />
            <button className="bg-white text-black px-12 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-colors">
              Join Now
            </button>
          </form>
          <p className="mt-6 text-[9px] text-white/30 uppercase tracking-[0.3em] font-medium">
            Privacy respected. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
