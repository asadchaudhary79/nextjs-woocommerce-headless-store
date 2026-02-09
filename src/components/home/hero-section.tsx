"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-white py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Where Minimalist Design <br /> Meets Premium Quality
            </h1>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="rounded-full bg-black text-white px-8 hover:bg-gray-800 flex items-center gap-2 group"
                >
                  Shop Now
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-gray-200 text-gray-700 px-8 hover:bg-gray-50 flex items-center gap-2 group"
                >
                  View Categories
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-gray-400 group-hover:text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          <div className="max-w-md lg:mt-4">
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Discover our curated selection of premium essentials, designed for
              the modern lifestyle. Enjoy smooth navigation and secure checkout
              for a seamless shopping experience.
            </p>
          </div>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 h-auto lg:h-[700px]">
          {/* Left Column - Large Horizontal Card */}
          <div className="lg:col-span-6 relative group overflow-hidden rounded-[2.5rem] shadow-sm bg-gray-50 h-[400px] lg:h-full">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
              alt="Luxury Fashion"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12 text-white bg-linear-to-t from-black/60 to-transparent">
              <h3 className="text-2xl lg:text-3xl font-bold max-w-xs">
                Find Sustainable Comfort While Exploring Modern Classics
              </h3>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-80">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                125 Items
              </div>
            </div>
            <div className="absolute top-8 right-8">
              <button className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-black shadow-lg transition-transform hover:scale-110 active:scale-95">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full">
            {/* Top Card */}
            <div className="relative group flex-1 min-h-[300px] overflow-hidden rounded-[2.5rem] shadow-sm bg-gray-50">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
                alt="Accessories"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white bg-linear-to-t from-black/60 to-transparent">
                <h3 className="text-xl font-bold leading-tight">
                  Discover Warm and Inspiring Textures to Enjoy
                </h3>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium opacity-80">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  83 Items
                </div>
              </div>
              <div className="absolute top-6 right-6 scale-90">
                <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black shadow-lg transition-transform hover:scale-110">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Tall Vertical Card */}
          <div className="lg:col-span-3 relative group overflow-hidden rounded-[2.5rem] shadow-sm bg-gray-50 h-[500px] lg:h-full">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040"
              alt="Campaign"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white bg-linear-to-t from-black/60 to-transparent">
              <h3 className="text-xl font-bold leading-tight">
                Explore Creative Fashion Ideas Inside These Collections
              </h3>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium opacity-80">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                47 Items
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black shadow-lg transition-transform hover:scale-110">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
