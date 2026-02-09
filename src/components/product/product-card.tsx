"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import type { WCProduct } from "@/types/woocommerce";
import { formatPrice, calculateDiscount, getProductUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: WCProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const mainImage = product.images[0];
  const hoverImage = product.images[1];
  const hasDiscount =
    product.on_sale && product.regular_price && product.sale_price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.regular_price, product.sale_price)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link href={getProductUrl(product.slug)} className="block">
        {/* Image Container with Hover Effects */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Main Image */}
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-300"
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

          {/* Hover Image Overlay */}
          {hoverImage && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <Image
                src={hoverImage.src}
                alt={hoverImage.alt || product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {product.on_sale && (
              <div className="bg-black text-white px-3 py-1.5 text-xs font-medium rounded-full shadow-lg">
                SAVE {discountPercent}%
              </div>
            )}
            {product.featured && (
              <div className="bg-white text-black px-3 py-1.5 text-xs font-medium rounded-full shadow-lg">
                NEW ARRIVAL
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to wishlist logic here
            }}
            className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
          >
            <Heart className="h-4 w-4 text-gray-700" />
          </button>

          {/* Out of Stock Overlay */}
          {product.stock_status === "outofstock" && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm">
              <span className="text-base font-medium text-gray-600 tracking-wide">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Quick Add Button - Slide Up */}
          {product.stock_status !== "outofstock" && (
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Quick add to cart logic here
                }}
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-5 font-medium shadow-xl transform transition-transform hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {product.type === "variable" ? "SELECT OPTIONS" : "ADD TO CART"}
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 px-1">
          {/* Category */}
          {product.categories.length > 0 && (
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
              {product.categories[0].name}
            </p>
          )}

          {/* Title */}
          <h3 className="text-base font-light text-gray-900 leading-snug line-clamp-2 mb-2 min-h-[44px]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-3 mb-3">
            {product.on_sale ? (
              <>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.type === "variable" && product.attributes.length > 0 && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex items-center gap-1">
                {product.attributes
                  .find((attr) => attr.name.toLowerCase() === "color")
                  ?.options.slice(0, 5)
                  .map((color, index) => (
                    <div key={color} className="relative group/color">
                      <div
                        className="h-4 w-4 rounded-full border border-gray-300 transition-transform group-hover/color:scale-125"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                      {index < 4 && (
                        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-700 bg-white px-1.5 py-0.5 rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                          {color}
                        </span>
                      )}
                    </div>
                  ))}
                {(product.attributes.find(
                  (attr) => attr.name.toLowerCase() === "color",
                )?.options.length || 0) > 5 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +
                    {(product.attributes.find(
                      (attr) => attr.name.toLowerCase() === "color",
                    )?.options.length || 0) - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
