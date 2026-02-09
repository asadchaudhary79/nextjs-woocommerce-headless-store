"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { WCImage } from "@/types/woocommerce";
import { cn } from "@/lib/utils";

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
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-2xl bg-gray-50 shadow-sm transition-shadow hover:shadow-md"
        onClick={() => setIsZoomed(true)}
      >
        {selectedImage ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative h-full w-full"
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt || productName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        {/* Navigation Arrows */}
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
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100 disabled:cursor-not-allowed"
              aria-label="Previous image"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 opacity-0 shadow-lg transition-all hover:bg-white group-hover:opacity-100 disabled:cursor-not-allowed"
              aria-label="Next image"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "group relative aspect-square shrink-0 overflow-hidden rounded-xl bg-gray-50 transition-all hover:ring-2 hover:ring-gray-200",
                selectedIndex === index
                  ? "ring-2 ring-black"
                  : "ring-1 ring-gray-100",
              )}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-300 group-hover:scale-110",
                  selectedIndex === index
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-100",
                )}
                sizes="150px"
              />
            </button>
          ))}
          {images.length > 4 && (
            <button
              onClick={() => setIsZoomed(true)}
              className="relative aspect-square flex items-center justify-center rounded-xl bg-gray-100 text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              +{images.length - 4} More
            </button>
          )}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            onClick={() => setIsZoomed(false)}
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute right-4 top-4 z-10 p-2 hover:bg-gray-100"
              aria-label="Close zoom"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative h-full w-full">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt || productName}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Zoom Navigation */}
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 hover:bg-white"
                  aria-label="Previous image"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1,
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 hover:bg-white"
                  aria-label="Next image"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Zoom Thumbnails */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    selectedIndex === index ? "bg-black" : "bg-gray-300",
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
