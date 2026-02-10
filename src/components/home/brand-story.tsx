"use client";

import Image from "next/image";
import Link from "next/link";

export function BrandStory() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl z-10 transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2070"
                alt="Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square rounded-[2rem] bg-neutral-50 -z-0 border border-neutral-100 hidden lg:block" />
            <div className="absolute top-10 -left-10 p-8 bg-black text-white rounded-2xl z-20 hidden lg:flex flex-col gap-2 shadow-xl animate-bounce-subtle">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
                Certification
              </span>
              <span className="text-xl font-bold italic text-neutral-100">
                100% Organic
              </span>
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
              the wearer, but of the hands that crafted them, the soil that grew
              the fibers, and the vision that brought it all together.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
              <div className="space-y-2">
                <h4 className="font-bold text-sm tracking-widest uppercase text-neutral-900">
                  Ethics First
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  Sourced from certified fair-trade partners globally.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm tracking-widest uppercase text-neutral-900">
                  Pure Quality
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  Natural fibers designed to last for generations.
                </p>
              </div>
            </div>
            <Link
              href="/about"
              className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-900 mt-4 transition-colors hover:text-neutral-600"
            >
              Learn our story
              <span className="h-[1px] w-12 bg-black transition-all duration-500 group-hover:w-20" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
