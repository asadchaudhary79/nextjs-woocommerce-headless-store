"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { WCProduct, WCProductVariation } from "@/types/woocommerce";
import { useCartStore } from "@/stores/cart-store";
import {
  formatPrice,
  getStockStatusLabel,
  getStockStatusColor,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";

interface ProductInfoProps {
  product: WCProduct;
  variations: WCProductVariation[];
}

export function ProductInfo({ product, variations }: ProductInfoProps) {
  const { addItem } = useCartStore();
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isVariable = product.type === "variable";

  const selectedVariation = useMemo(() => {
    if (!isVariable || variations.length === 0) return null;

    return variations.find((variation) =>
      variation.attributes.every((attr) => {
        const selectedValue = selectedAttributes[attr.name];
        return !attr.option || attr.option === selectedValue;
      }),
    );
  }, [isVariable, variations, selectedAttributes]);

  const currentPrice = selectedVariation?.price || product.price;
  const currentRegularPrice =
    selectedVariation?.regular_price || product.regular_price;
  const currentSalePrice = selectedVariation?.sale_price || product.sale_price;
  const isOnSale = selectedVariation?.on_sale ?? product.on_sale;
  const stockStatus = selectedVariation?.stock_status || product.stock_status;
  const stockQuantity =
    selectedVariation?.stock_quantity ?? product.stock_quantity;

  const allAttributesSelected = useMemo(() => {
    if (!isVariable) return true;
    return product.attributes
      .filter((attr) => attr.variation)
      .every((attr) => selectedAttributes[attr.name]);
  }, [isVariable, product.attributes, selectedAttributes]);

  const canAddToCart = stockStatus === "instock" && allAttributesSelected;

  const handleAddToCart = async () => {
    if (!canAddToCart) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    addItem({
      productId: product.id,
      variationId: selectedVariation?.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(currentPrice),
      regularPrice: currentRegularPrice
        ? parseFloat(currentRegularPrice)
        : undefined,
      quantity,
      image: selectedVariation?.image?.src || product.images[0]?.src || "",
      attributes: isVariable ? selectedAttributes : undefined,
      maxQuantity: stockQuantity || undefined,
    });

    setIsAdding(false);
  };

  return (
    <div className="lg:sticky lg:top-32">
      {/* Category & Status */}
      <div className="mb-4 flex items-center justify-between">
        {product.categories[0] && (
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
            {product.categories[0].name}
          </span>
        )}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              stockStatus === "instock" ? "bg-emerald-500" : "bg-rose-500",
            )}
          />
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              getStockStatusColor(stockStatus),
            )}
          >
            {getStockStatusLabel(stockStatus)}
          </span>
        </div>
      </div>

      {/* Product Name */}
      <h1 className="text-4xl font-light uppercase tracking-[0.1em] text-neutral-900 lg:text-5xl lg:leading-tight">
        {product.name}
      </h1>

      {/* Price Section */}
      <div className="mt-8 flex items-baseline gap-4">
        {isOnSale && currentSalePrice ? (
          <>
            <span className="text-3xl font-light text-rose-600">
              {formatPrice(currentSalePrice)}
            </span>
            <span className="text-lg text-neutral-300 line-through">
              {formatPrice(currentRegularPrice)}
            </span>
          </>
        ) : (
          <span className="text-3xl font-light text-neutral-900">
            {currentPrice ? formatPrice(currentPrice) : "Price unavailable"}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <div
          className="mt-8 text-base leading-relaxed text-neutral-500 prose prose-neutral max-w-none font-light"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      {/* Variants */}
      {isVariable &&
        product.attributes.filter((attr) => attr.variation).length > 0 && (
          <div className="mt-12 space-y-8">
            {product.attributes
              .filter((attr) => attr.variation)
              .map((attribute) => (
                <div key={attribute.id}>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900">
                      {attribute.name}
                    </span>
                    {selectedAttributes[attribute.name] && (
                      <span className="text-[10px] font-medium text-neutral-400">
                        {selectedAttributes[attribute.name]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {attribute.options.map((option) => {
                      const isSelected =
                        selectedAttributes[attribute.name] === option;
                      const isColor = attribute.name.toLowerCase() === "color";

                      const isAvailable = variations.some((v) => {
                        const attrMatch = v.attributes.find(
                          (a) => a.name === attribute.name,
                        );
                        return (
                          (!attrMatch?.option || attrMatch.option === option) &&
                          v.stock_status === "instock"
                        );
                      });

                      if (isColor) {
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setSelectedAttributes((prev) => ({
                                ...prev,
                                [attribute.name]: option,
                              }))
                            }
                            disabled={!isAvailable}
                            className={cn(
                              "group relative h-10 w-10 flex items-center justify-center rounded-full border border-neutral-100 transition-all active:scale-95",
                              isSelected
                                ? "ring-2 ring-neutral-900 ring-offset-2"
                                : "hover:scale-105",
                              !isAvailable && "opacity-20 cursor-not-allowed",
                            )}
                          >
                            <div
                              className="h-8 w-8 rounded-full shadow-inner"
                              style={{ backgroundColor: option.toLowerCase() }}
                            />
                          </button>
                        );
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [attribute.name]: option,
                            }))
                          }
                          disabled={!isAvailable}
                          className={cn(
                            "min-w-[64px] border px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95",
                            isSelected
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-900 hover:text-neutral-900",
                            !isAvailable &&
                              "opacity-20 cursor-not-allowed line-through",
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

      {/* Actions */}
      <div className="mt-12 flex flex-col gap-6">
        <div className="flex flex-wrap items-stretch gap-4">
          {/* Quantity Selector */}
          <div className="flex h-16 items-center border border-neutral-200 bg-neutral-50/50 px-4 transition-all focus-within:border-neutral-900 focus-within:bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center text-neutral-400 hover:text-neutral-900"
            >
              <span className="text-xl font-light">−</span>
            </button>
            <span className="w-12 text-center text-sm font-bold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) =>
                  stockQuantity ? Math.min(stockQuantity, q + 1) : q + 1,
                )
              }
              disabled={stockQuantity ? quantity >= stockQuantity : false}
              className="flex h-8 w-8 items-center justify-center text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
            >
              <span className="text-xl font-light">+</span>
            </button>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            isLoading={isAdding}
            className="h-16 flex-1 bg-neutral-900 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-neutral-800"
          >
            {stockStatus === "outofstock"
              ? "Out of Stock"
              : !allAttributesSelected
                ? "Select Your Size"
                : "Add to Bag"}
          </Button>

          {/* Wishlist */}
          <button className="flex h-16 w-16 items-center justify-center border border-neutral-200 transition-all hover:border-neutral-900 group">
            <Heart className="h-5 w-5 text-neutral-900 transition-colors group-hover:fill-neutral-900" />
          </button>
        </div>

        {/* Quick Trust */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
          <div className="flex items-center gap-2">
            <Truck className="h-3 w-3" />
            <span>Free Express Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3" />
            <span>30-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="mt-16 space-y-px border-t border-neutral-100">
        {[
          { title: "Description", content: product.description },
          {
            title: "Shipping & Returns",
            content:
              "We provide worldwide express shipping. All orders are processed within 24 hours. Returns are accepted within 30 days of delivery for a full refund or exchange.",
          },
          {
            title: "Assistance",
            content:
              "Have a question about this piece? Reach out to our concierge service at support@example.com or via Live Chat.",
          },
        ].map((item, i) => (
          <details key={i} className="group border-b border-neutral-100">
            <summary className="flex cursor-pointer items-center justify-between py-6 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900 transition-colors hover:text-neutral-500">
              {item.title}
              <motion.span
                animate={{ rotate: 0 }}
                className="text-lg font-light group-open:rotate-45 transition-transform"
              >
                +
              </motion.span>
            </summary>
            <div
              className="prose prose-neutral max-w-none pb-8 text-sm font-light leading-relaxed text-neutral-500 animate-in fade-in slide-in-from-top-2 duration-500"
              dangerouslySetInnerHTML={{ __html: item.content || "" }}
            />
          </details>
        ))}
      </div>
    </div>
  );
}
