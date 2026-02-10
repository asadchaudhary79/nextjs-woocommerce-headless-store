"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { WCImage } from "@/types/woocommerce";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface ProductGalleryProps {
  images: WCImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const hasImages = images.length > 0;
  const selectedImage = hasImages ? images[selectedIndex] : null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row-reverse">
      {/* Main Image Container */}
      <div
        className="group relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden bg-neutral-50"
        onClick={() => setIsZoomed(true)}
      >
        {selectedImage ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="relative h-full w-full"
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt || productName}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Maximize2 className="h-12 w-12 text-neutral-200" strokeWidth={1} />
          </div>
        )}

        {/* Floating Maximize Icon */}
        <div className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
          <Maximize2 className="h-5 w-5 text-neutral-900" strokeWidth={1.5} />
        </div>

        {/* Navigation Overlays */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/50 opacity-0 backdrop-blur-md transition-all hover:bg-white group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/50 opacity-0 backdrop-blur-md transition-all hover:bg-white group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Sidebar - Editorial Style */}
      {images.length > 1 && (
        <div className="flex flex-row gap-3 lg:w-20 lg:flex-col lg:gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden bg-neutral-50 transition-all duration-500 lg:w-full",
                selectedIndex === index
                  ? "ring-1 ring-neutral-900 ring-offset-2"
                  : "opacity-40 hover:opacity-100",
              )}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modern Zoom Modal */}
      <AnimatePresence>
        {isZoomed && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl"
            onClick={() => setIsZoomed(false)}
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute right-8 top-8 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform hover:scale-110 active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative h-[85vh] w-[85vw]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt || productName}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            {/* Modal Navigation */}
            {images.length > 1 && (
              <div className="absolute inset-x-8 top-1/2 flex -translate-y-1/2 justify-between px-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1,
                    );
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 transition-all hover:border-neutral-900"
                >
                  <ChevronLeft className="h-8 w-8 text-neutral-900" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1,
                    );
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 transition-all hover:border-neutral-900"
                >
                  <ChevronRight className="h-8 w-8 text-neutral-900" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
