"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useCartItemCount } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { Search } from "./search";
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
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<WCCategory[]>(initialCategories);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart } = useCartStore();
  const itemCount = useCartItemCount();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const mainCategories = categories.slice(0, 4);
  const secondaryCategories = categories.slice(4);

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
      <div className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm">
          <p className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
            Free shipping on orders over $50
            <span className="hidden sm:inline"> • New collection launched</span>
          </p>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          {/* Top Bar */}
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="font-heading text-2xl font-bold tracking-tighter">
                ELEVATE
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-8 mx-8">
              <Link
                href="/shop"
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-black relative",
                  pathname === "/shop" || pathname.startsWith("/shop/")
                    ? "text-black font-semibold after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-black"
                    : "text-gray-600",
                )}
              >
                Shop All
              </Link>

              {mainCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 hover:text-black relative",
                    pathname.startsWith(`/shop/${category.slug}`)
                      ? "text-black font-semibold after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-black"
                      : "text-gray-600",
                  )}
                >
                  {category.name}
                </Link>
              ))}

              <Link
                href="/new-arrivals"
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-black relative",
                  pathname === "/new-arrivals"
                    ? "text-black font-semibold after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-black"
                    : "text-gray-600",
                )}
              >
                New Arrivals
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
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
                <span className="hidden lg:inline">Search</span>
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
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
                <span className="hidden lg:inline">Account</span>
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                aria-label="Open cart"
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
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                    {itemCount}
                  </span>
                )}
                <span className="hidden lg:inline">Cart</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="lg:hidden ml-2"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1">
                  <span
                    className={`h-0.5 w-6 bg-black transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                  ></span>
                  <span
                    className={`h-0.5 w-6 bg-black transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`}
                  ></span>
                  <span
                    className={`h-0.5 w-6 bg-black transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {/* Trending Tags Bar */}
          <div className="hidden lg:flex items-center justify-center gap-6 pb-4 border-t border-gray-100 pt-3">
            {trendingTags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-wider"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                onClick={closeMobileMenu}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl lg:hidden"
              >
                <div className="flex h-20 items-center justify-between border-b px-6">
                  <div className="font-heading text-xl font-bold">ELEVATE</div>
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                    className="p-2"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
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

                <div className="overflow-y-auto h-[calc(100vh-5rem)]">
                  {/* Categories */}
                  <div className="px-6 py-8 border-b">
                    <p className="text-sm font-semibold text-gray-900 mb-6">
                      Shop
                    </p>
                    <div className="space-y-4">
                      <Link
                        href="/shop"
                        className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                        onClick={closeMobileMenu}
                      >
                        All Products
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/shop/${category.slug}`}
                          className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="px-6 py-8 border-b">
                    <div className="space-y-4">
                      <Link
                        href="/new-arrivals"
                        className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                        onClick={closeMobileMenu}
                      >
                        New Arrivals
                      </Link>
                      <Link
                        href="/bestsellers"
                        className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Bestsellers
                      </Link>
                      <Link
                        href="/sustainability"
                        className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Sustainability
                      </Link>
                    </div>
                  </div>

                  {/* Account Links */}
                  <div className="px-6 py-8">
                    <div className="space-y-4">
                      <Link
                        href="/account"
                        className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                        onClick={closeMobileMenu}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Wishlist
                      </Link>
                      <Link
                        href="/contact"
                        className="block text-lg font-light text-gray-800 hover:text-black transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>

                  {/* Trending Tags */}
                  <div className="px-6 py-8 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 mb-4">
                      Trending Now
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trendingTags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                          className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
                          onClick={closeMobileMenu}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
