"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import type { WCProduct } from "@/types/woocommerce";
import { formatPrice, calculateDiscount, getProductUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

interface ProductCardProps {
  product: WCProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const mainImage = product.images[0];
  const hoverImage = product.images[1];
  const hasDiscount =
    product.on_sale &&
    product.regular_price &&
    product.sale_price &&
    product.regular_price !== product.sale_price;

  const discountPercent = hasDiscount
    ? calculateDiscount(product.regular_price, product.sale_price)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.type === "simple") {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        regularPrice: Number(product.regular_price || product.price),
        quantity: 1,
        image: mainImage?.src || "",
        maxQuantity: product.stock_quantity || undefined,
      });
    } else {
      window.location.href = getProductUrl(product.slug);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={getProductUrl(product.slug)} className="block">
        {/* Image Container with Hover Effects */}
        <div className="relative aspect-4/5 overflow-hidden bg-[#F8F8F8] rounded-4xl">
          {/* Main Image */}
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-100">
              <ShoppingBag
                className="h-8 w-8 text-neutral-300"
                strokeWidth={1}
              />
            </div>
          )}

          {/* Hover Image Overlay */}
          {hoverImage && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <Image
                src={hoverImage.src}
                alt={hoverImage.alt || product.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
            {hasDiscount && discountPercent > 0 && (
              <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                -{discountPercent}%
              </div>
            )}
            {product.featured && (
              <div className="bg-white text-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
                Series 01
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:scale-110"
          >
            <Heart className="h-4 w-4 text-black" />
          </button>

          {/* Quick Add Button */}
          {product.stock_status !== "outofstock" && (
            <div className="absolute inset-x-0 bottom-6 px-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <Button
                type="button"
                onClick={handleQuickAdd}
                className="w-full h-14 bg-white hover:bg-black hover:text-white text-black rounded-full font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 border border-black/5"
              >
                {product.type === "variable" ? "Select Options" : "Quick Add"}
              </Button>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock_status === "outofstock" && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
              <span className="bg-black text-white px-6 py-2 text-[10px] font-black tracking-[0.3em] rounded-full">
                ARCHIVED
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-6 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Category */}
              {product.categories.length > 0 && (
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">
                  {product.categories[0].name}
                </p>
              )}
              {/* Title */}
              <h3 className="text-base font-bold text-neutral-900 leading-tight tracking-tight group-hover:text-black transition-colors line-clamp-1">
                {product.name}
              </h3>
            </div>
            {/* Price */}
            <div className="text-right">
              {product.on_sale ? (
                <div className="flex flex-col items-end">
                  <span className="text-base font-black text-neutral-900">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold line-through tracking-wider">
                    {formatPrice(product.regular_price)}
                  </span>
                </div>
              ) : (
                <span className="text-base font-black text-neutral-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Attributes/Swatches */}
          {product.type === "variable" && product.attributes.length > 0 && (
            <div className="flex items-center gap-2 pt-3">
              <div className="flex items-center gap-1.5">
                {product.attributes
                  .find((attr) => attr.name.toLowerCase() === "color")
                  ?.options.slice(0, 4)
                  .map((color) => (
                    <div
                      key={color}
                      className="h-3 w-3 rounded-full border border-neutral-100 ring-1 ring-neutral-950/5 ring-inset ring-offset-1 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                {(product.attributes.find(
                  (attr) => attr.name.toLowerCase() === "color",
                )?.options.length || 0) > 4 && (
                  <span className="text-[9px] font-black text-neutral-400 tracking-wider">
                    +
                    {(product.attributes.find(
                      (attr) => attr.name.toLowerCase() === "color",
                    )?.options.length || 0) - 4}
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
