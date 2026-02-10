"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects for the image stack
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-24 lg:pt-32  overflow-hidden bg-[#fdfdfd]"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[700px] h-[700px] bg-neutral-100 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-neutral-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Vertical 'EST.' Text Background */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 hidden 2xl:block pointer-events-none">
        <span className="text-[140px] font-bold text-black/[0.02] tracking-tighter leading-none select-none">
          MMLX VI
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Content - Editorial Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] w-fit"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  New Spring Collection '26
                </span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl lg:text-[100px] xl:text-[120px] font-bold tracking-tighter leading-[0.85] text-neutral-900">
                TIMELESS <br />
                <span
                  className="text-transparent italic"
                  style={{ WebkitTextStroke: "1px #171717" }}
                >
                  MODERN
                </span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-md text-lg md:text-xl text-neutral-500 font-light leading-relaxed"
            >
              Beyond the fleeting trends. Discover a realm where luxury meets
              function, crafted for those who redefine the boundaries of modern
              living.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="rounded-none h-16 px-12 text-sm font-bold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all duration-500 shadow-xl shadow-black/10 group overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Shop Now
                    <svg
                      className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M1 8H15M15 8L8 1M15 8L8 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>

              <Link
                href="/shop"
                className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-neutral-900"
              >
                <span className="h-[1px] w-8 bg-black transition-all duration-500 group-hover:w-12" />
                Explore Categories
              </Link>
            </motion.div>

            {/* Social Proof Divider */}
            <div className="flex items-center gap-12 mt-6 pt-10 border-t border-neutral-100">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-neutral-100 overflow-hidden relative"
                  >
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-black flex items-center justify-center text-[10px] text-white font-bold">
                  +2K
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-[120px] font-medium leading-tight">
                Trusted by 2,000+ tastemakers worldwide.
              </p>
            </div>
          </motion.div>

          {/* Right Visuals - Asymmetric Parallax Stack */}
          <div className="relative h-[600px] md:h-[750px] lg:h-[850px] w-full mt-12 lg:mt-0">
            {/* Background Accent Card */}
            <motion.div
              style={{ rotate: rotate1, y: y1 }}
              className="absolute top-10 right-0 w-[85%] aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-neutral-50 shadow-sm"
            >
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
                alt="Editorial Look"
                fill
                className="object-cover opacity-90 scale-110"
              />
              <div className="absolute inset-0 bg-neutral-900/10" />
            </motion.div>

            {/* Main Foreground Card */}
            <motion.div
              style={{ y: y2 }}
              className="absolute top-[20%] left-0 w-[75%] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white z-20"
            >
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040"
                alt="Main Collection"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-80">
                  Vol. 01 Edition
                </p>
                <h3 className="text-3xl font-bold tracking-tight">
                  Essential Minimalism
                </h3>
              </div>
            </motion.div>

            {/* Smaller Accent 'Badge' Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-[10%] right-[10%] w-[180px] h-[180px] rounded-full border-[8px] border-white shadow-2xl z-30 overflow-hidden hidden md:block"
            >
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
                alt="Accessory"
                fill
                className="object-cover hover:scale-125 transition-transform duration-1000"
              />
            </motion.div>

            {/* Floating 'Price Card' Accent */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-[45%] left-[-5%] bg-white p-6 rounded-2xl shadow-2xl z-40 hidden xl:flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Premium Quality
                </span>
              </div>
              <div className="h-px w-full bg-neutral-100" />
              <div className="text-sm font-medium text-neutral-400">
                Starting from
              </div>
              <div className="text-2xl font-bold">$189.00</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Slide Hint */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
      >
        <div className="w-[1px] h-12 bg-neutral-200 relative overflow-hidden">
          <motion.div
            animate={{ y: [-48, 48] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-black"
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
