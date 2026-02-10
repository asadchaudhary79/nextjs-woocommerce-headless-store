"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function NomadCampaign() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden group">
      <Image
        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"
        alt="Campaign"
        fill
        className="object-cover transition-transform duration-[2s] group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-colors duration-700 group-hover:bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl flex flex-col items-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.5em] mb-8 block opacity-80 scale-90 group-hover:scale-100 transition-transform duration-700">
            Spring Summer 2026
          </span>
          <h2 className="text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.85] uppercase">
            NOMAD <br />
            <span className="italic font-extralight text-neutral-200">
              COLLECTION
            </span>
          </h2>
          <p className="mt-12 max-w-lg text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
            Ethereal fabrics and earthy tones designed for the modern wanderer.
            Discover the essence of slow living and conscious craftsmanship.
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-8">
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-full h-16 px-14 bg-white text-black hover:bg-neutral-100 uppercase tracking-[0.2em] text-[10px] font-black shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Explore Edition
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 px-14 border-white/30 text-white hover:bg-white hover:text-black uppercase tracking-[0.2em] text-[10px] font-black backdrop-blur-md transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Visual Story
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-12 left-12 h-20 w-[1px] bg-white/20 hidden lg:block" />
      <div className="absolute bottom-12 right-12 h-20 w-[1px] bg-white/20 hidden lg:block" />
    </section>
  );
}
