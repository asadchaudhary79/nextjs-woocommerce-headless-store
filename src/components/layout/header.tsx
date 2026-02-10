"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useCartItemCount } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { Search } from "./search";
import Image from "next/image";
import type { WCCategory } from "@/types/woocommerce";

interface HeaderProps {
  initialCategories?: WCCategory[];
}

const trendingTags = [
  "New Arrivals",
  "Bestsellers",
  "Sustainable",
  "Luxury",
  "Minimalist",
];

export function Header({ initialCategories = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<WCCategory[]>(initialCategories);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart } = useCartStore();
  const itemCount = useCartItemCount();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const mainCategories = categories.slice(0, 5);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-black text-white relative z-60">
        <div className="w-full px-6 py-2 text-center text-[11px] font-bold uppercase tracking-[0.2em]">
          <p className="inline-flex items-center gap-3">
            <span className="inline-block h-1 w-1 rounded-full bg-white animate-pulse" />
            Complementary Worldwide Shipping on All Orders Over $150
            <span className="hidden sm:inline opacity-50">|</span>
            <Link
              href="/shop"
              className="underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Shop the Collection
            </Link>
          </p>
        </div>
      </div>

      {/* Main Header */}
      <header
        onMouseLeave={() => setActiveMegaMenu(null)}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 border-b",
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-neutral-200 py-2"
            : "bg-white border-transparent py-4",
        )}
      >
        <div className="w-full px-6 lg:px-12">
          {/* Top Bar */}
          <div className="flex h-16 items-center justify-between">
            {/* Left - Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              <div
                onMouseEnter={() => setActiveMegaMenu("shop")}
                className="relative cursor-pointer py-4"
              >
                <Link
                  href="/shop"
                  className={cn(
                    "text-[13px] font-bold uppercase tracking-widest transition-colors hover:text-neutral-500",
                    pathname.startsWith("/shop")
                      ? "text-black"
                      : "text-neutral-500",
                  )}
                >
                  Shop
                </Link>
              </div>

              {mainCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className={cn(
                    "text-[13px] font-bold uppercase tracking-widest transition-colors hover:text-black",
                    pathname.startsWith(`/shop/${category.slug}`)
                      ? "text-black"
                      : "text-neutral-500",
                  )}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Center - Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <div className="font-heading text-3xl font-black tracking-[-0.05em] text-black">
                ELEVATE
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-8">
              {/* Search */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors group"
                aria-label="Search"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <span className="hidden xl:inline text-[11px] font-bold uppercase tracking-widest">
                  Search
                </span>
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-2 text-neutral-500 hover:text-black transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span className="hidden xl:inline text-[11px] font-bold uppercase tracking-widest">
                  Account
                </span>
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 text-neutral-500 hover:text-black transition-colors"
                aria-label="Open cart"
              >
                <div className="relative">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-[11px] font-bold uppercase tracking-widest">
                  Bag
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="lg:hidden p-2"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1.5">
                  <span
                    className={cn(
                      "h-0.5 w-6 bg-black transition-all",
                      isMobileMenuOpen && "rotate-45 translate-y-2",
                    )}
                  />
                  <span
                    className={cn(
                      "h-0.5 w-6 bg-black transition-all",
                      isMobileMenuOpen && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "h-0.5 w-6 bg-black transition-all",
                      isMobileMenuOpen && "-rotate-45 -translate-y-2",
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 w-full bg-white border-b border-neutral-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] hidden lg:block"
              onMouseEnter={() => setActiveMegaMenu("shop")}
            >
              <div className="w-full px-12 py-16 grid grid-cols-12 gap-12">
                {/* Categories Column */}
                <div className="col-span-3 space-y-8">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                    Collections
                  </h3>
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/shop"
                      className="text-2xl font-bold hover:text-neutral-500 transition-colors"
                    >
                      Shop All
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop/${cat.slug}`}
                        className="text-2xl font-bold hover:text-neutral-500 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Featured Column 1 */}
                <div className="col-span-3 space-y-8">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                    Featured Tags
                  </h3>
                  <div className="flex flex-col gap-4">
                    {trendingTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tag/${tag.toLowerCase()}`}
                        className="text-lg font-medium text-neutral-600 hover:text-black transition-colors"
                      >
                        # {tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Visual Feature 1 */}
                <div className="col-span-3">
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden group">
                    <Image
                      src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
                      alt="New Arrivals"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
                        Just In
                      </p>
                      <h4 className="text-xl font-bold">New Arrivals</h4>
                    </div>
                  </div>
                </div>

                {/* Visual Feature 2 */}
                <div className="col-span-3">
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden group">
                    <Image
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040"
                      alt="Summer Edit"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
                        Curated
                      </p>
                      <h4 className="text-xl font-bold">Summer Edit</h4>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-70 lg:hidden backdrop-blur-sm"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-80 w-full max-w-[320px] bg-white shadow-2xl lg:hidden"
              >
                <div className="flex flex-col h-full">
                  <div className="flex h-20 items-center justify-between px-6 border-b">
                    <div className="font-heading text-xl font-black">
                      ELEVATE
                    </div>
                    <button onClick={closeMobileMenu} className="p-2">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                        Navigate
                      </p>
                      <div className="flex flex-col gap-6">
                        <Link
                          href="/shop"
                          onClick={closeMobileMenu}
                          className="text-3xl font-bold"
                        >
                          Shop All
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop/${cat.slug}`}
                            onClick={closeMobileMenu}
                            className="text-3xl font-bold"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Secondary Full Width Bar - Trending Tags */}
      <div className="w-full bg-neutral-50 border-b border-neutral-200 hidden lg:block">
        <div className="w-full px-12 py-3 flex items-center justify-center gap-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Trending:
          </span>
          {trendingTags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[11px] font-bold text-neutral-600 hover:text-black transition-colors uppercase tracking-widest relative group"
            >
              {tag}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
