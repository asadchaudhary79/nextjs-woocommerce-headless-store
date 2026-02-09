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
  stripHtml,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  // Find matching variation based on selected attributes
  const selectedVariation = useMemo(() => {
    if (!isVariable || variations.length === 0) return null;

    return variations.find((variation) =>
      variation.attributes.every((attr) => {
        const selectedValue = selectedAttributes[attr.name];
        // Empty option means "any"
        return !attr.option || attr.option === selectedValue;
      }),
    );
  }, [isVariable, variations, selectedAttributes]);

  // Get current price (from variation or product)
  const currentPrice = selectedVariation?.price || product.price;
  const currentRegularPrice =
    selectedVariation?.regular_price || product.regular_price;
  const currentSalePrice = selectedVariation?.sale_price || product.sale_price;
  const isOnSale = selectedVariation?.on_sale ?? product.on_sale;
  const stockStatus = selectedVariation?.stock_status || product.stock_status;
  const stockQuantity =
    selectedVariation?.stock_quantity ?? product.stock_quantity;

  // Check if all required attributes are selected
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

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

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
    <div className="lg:sticky lg:top-24">
      {/* Product Name */}
      <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
        {product.name}
      </h1>

      {/* Price */}
      <div className="mt-4 flex items-center gap-3">
        {isOnSale && currentSalePrice ? (
          <>
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(currentSalePrice)}
            </span>
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(currentRegularPrice)}
            </span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
              SALE
            </span>
          </>
        ) : (
          <span className="text-2xl font-bold text-gray-900">
            {currentPrice ? formatPrice(currentPrice) : "Price unavailable"}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="mt-6 flex items-center gap-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            stockStatus === "instock" ? "bg-green-500" : "bg-red-500",
          )}
        />
        <p
          className={cn(
            "text-sm font-medium",
            getStockStatusColor(stockStatus),
          )}
        >
          {getStockStatusLabel(stockStatus)}
          {stockQuantity && stockQuantity <= 5 && stockStatus === "instock" && (
            <span className="ml-1 text-gray-500 font-normal">
              - Only {stockQuantity} left
            </span>
          )}
        </p>
      </div>

      {/* Short Description */}
      {product.short_description && (
        <div
          className="mt-8 text-base leading-relaxed text-gray-600 prose prose-sm prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      {/* Variant Selectors */}
      {isVariable &&
        product.attributes.filter((attr) => attr.variation).length > 0 && (
          <div className="mt-6 space-y-4">
            {product.attributes
              .filter((attr) => attr.variation)
              .map((attribute) => (
                <div key={attribute.id}>
                  <label className="mb-2 block text-sm font-medium">
                    {attribute.name}
                    {selectedAttributes[attribute.name] && (
                      <span className="ml-2 font-normal text-gray-500">
                        : {selectedAttributes[attribute.name]}
                      </span>
                    )}
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {attribute.options.map((option) => {
                      const isSelected =
                        selectedAttributes[attribute.name] === option;
                      const isColor = attribute.name.toLowerCase() === "color";

                      // Check if this option is available in any variation
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
                              "h-8 w-8 rounded-full border-2 transition-all",
                              isSelected
                                ? "border-black ring-2 ring-black ring-offset-2"
                                : "border-gray-300",
                              !isAvailable && "opacity-30 cursor-not-allowed",
                            )}
                            style={{ backgroundColor: option.toLowerCase() }}
                            title={option}
                            aria-label={option}
                          />
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
                            "min-w-14 rounded-full border px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all",
                            isSelected
                              ? "border-black bg-black text-white shadow-md shadow-black/5"
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-900 hover:text-black",
                            !isAvailable &&
                              "opacity-30 cursor-not-allowed line-through",
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

      {/* Actions Section */}
      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-stretch gap-4">
          {/* Quantity Selector */}
          <div className="flex h-12 items-center rounded-full border border-gray-200 bg-gray-50/50 px-2 transition-colors focus-within:border-gray-900 focus-within:bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="group flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white hover:shadow-sm"
              aria-label="Decrease quantity"
            >
              <svg
                className="h-3 w-3 text-gray-500 group-hover:text-black"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </button>
            <span className="w-10 text-center text-sm font-bold tabular-nums">
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
              className="group flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white hover:shadow-sm disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <svg
                className="h-3 w-3 text-gray-500 group-hover:text-black"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            isLoading={isAdding}
            className="h-12 flex-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/5"
            size="lg"
          >
            {stockStatus === "outofstock"
              ? "Sold Out"
              : !allAttributesSelected
                ? "Select Options"
                : "Add to Bag"}
          </Button>

          {/* Wishlist Button */}
          <button
            type="button"
            title="Add to wishlist"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 transition-all hover:border-black hover:text-red-500 hover:shadow-md active:scale-95"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>

        {/* Confidence/Trust Badge or small help text */}
        <p className="mt-2 text-center text-xs text-gray-400">
          Complimentary shipping on all orders over $250.
        </p>
      </div>

      {/* Product Details Accordion */}
      <div className="mt-12 space-y-0 border-t border-gray-100">
        <details className="group border-b border-gray-100">
          <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-bold uppercase tracking-widest text-gray-900 transition-colors hover:text-gray-600">
            Description
            <span className="relative flex h-5 w-5 items-center justify-center">
              <div className="h-4 w-[2px] bg-gray-400 transition-transform duration-300 group-open:rotate-90" />
              <div className="absolute h-[2px] w-4 bg-gray-400" />
            </span>
          </summary>
          <div
            className="prose prose-sm prose-gray max-w-none pb-8 text-gray-600 animate-fadeIn"
            dangerouslySetInnerHTML={{
              __html: product.description || "No description available.",
            }}
          />
        </details>

        {product.sku && (
          <details className="group border-b border-gray-100 font-sans">
            <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-bold uppercase tracking-widest text-gray-900 transition-colors hover:text-gray-600">
              Details
              <span className="relative flex h-5 w-5 items-center justify-center">
                <div className="h-4 w-[2px] bg-gray-400 transition-transform duration-300 group-open:rotate-90" />
                <div className="absolute h-[2px] w-4 bg-gray-400" />
              </span>
            </summary>
            <div className="pb-8 space-y-2 text-sm text-gray-600 animate-fadeIn">
              <p className="flex justify-between">
                <span className="font-medium text-gray-900">SKU:</span>
                <span>{product.sku}</span>
              </p>
              {product.weight && (
                <p className="flex justify-between">
                  <span className="font-medium text-gray-900">Weight:</span>
                  <span>{product.weight} kg</span>
                </p>
              )}
              {product.dimensions.length && (
                <p className="flex justify-between">
                  <span className="font-medium text-gray-900">Dimensions:</span>
                  <span>
                    {product.dimensions.length} &times;{" "}
                    {product.dimensions.width} &times;{" "}
                    {product.dimensions.height} cm
                  </span>
                </p>
              )}
            </div>
          </details>
        )}

        <details className="group border-b border-gray-100">
          <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-bold uppercase tracking-widest text-gray-900 transition-colors hover:text-gray-600">
            Shipping & Returns
            <span className="relative flex h-5 w-5 items-center justify-center">
              <div className="h-4 w-[2px] bg-gray-400 transition-transform duration-300 group-open:rotate-90" />
              <div className="absolute h-[2px] w-4 bg-gray-400" />
            </span>
          </summary>
          <div className="pb-8 space-y-4 text-sm text-gray-600 animate-fadeIn font-sans leading-relaxed">
            <p>
              We offer free standard shipping on all orders over $150. Express
              shipping options are available at checkout.
            </p>
            <p>
              Returns are accepted within 30 days of purchase. Items must be in
              their original condition with all tags attached.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
