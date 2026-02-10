"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function CuratedCollections() {
  const collections = [
    {
      title: "Female Edit",
      slug: "women",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
      description: "Sophisticated essentials",
      offset: false,
    },
    {
      title: "Modern Masculine",
      slug: "men",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040",
      description: "Contemporary tailoring",
      offset: true,
    },
    {
      title: "Essentials",
      slug: "accessories",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099",
      description: "Timeless hardware",
      offset: false,
    },
  ];

  return (
    <section className="py-24 bg-neutral-950 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-500">
              The Vault
            </span>
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter uppercase italic leading-[0.8]">
              Curated Edits
            </h2>
          </div>
          <p className="text-neutral-400 font-light max-w-sm text-base leading-relaxed">
            A precise selection of pieces designed to elevate your daily ritual.
            Explore our specialized collections for every occasion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {collections.map((col, idx) => (
            <Link
              key={col.slug}
              href={`/shop/${col.slug}`}
              className={`group relative aspect-[3/4] rounded-[3rem] overflow-hidden ${col.offset ? "lg:mt-24" : ""}`}
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-12 flex flex-col justify-end gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 group-hover:text-white transition-colors">
                  {col.description}
                </span>
                <h3 className="text-4xl font-bold tracking-tight uppercase leading-none">
                  {col.title.split(" ").map((word, i) => (
                    <span key={i} className="block">
                      {word}
                    </span>
                  ))}
                </h3>
                <div className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    Shop Collection
                  </span>
                  <div className="h-[1px] w-12 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
