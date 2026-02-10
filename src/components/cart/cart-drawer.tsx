"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import {
  useCartStore,
  useCartItems,
  useCartIsOpen,
  useCartTotal,
} from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const total = useCartTotal();
  const { closeCart, removeItem, updateQuantity } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with better blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/10 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-8 border-b border-neutral-50">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tighter uppercase">
                  Shopping Bag
                </h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">
                  {items.length} {items.length === 1 ? "Item" : "Items"} –{" "}
                  <span className="text-black italic">Series Archive</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 transition-all hover:bg-black hover:text-white"
                aria-label="Close cart"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-neutral-50 rounded-full scale-[2]" />
                    <ShoppingBag
                      className="relative h-12 w-12 text-neutral-300"
                      strokeWidth={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black tracking-tight uppercase">
                      Your bag is empty
                    </p>
                    <p className="text-sm text-neutral-400 max-w-[200px]">
                      Meticulously crafted essentials are waiting for you.
                    </p>
                  </div>
                  <Button
                    onClick={closeCart}
                    className="h-14 px-8 rounded-full bg-black hover:bg-neutral-800 text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    Start Exploring
                  </Button>
                </div>
              ) : (
                <ul className="space-y-8">
                  {items.map((item) => (
                    <motion.li
                      layout
                      key={item.id}
                      className="group flex gap-6"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="relative h-32 w-24 shrink-0 overflow-hidden bg-neutral-50 rounded-2xl"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag
                              className="h-6 w-6 text-neutral-200"
                              strokeWidth={1}
                            />
                          </div>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col py-1">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={closeCart}
                              className="text-sm font-black tracking-tight uppercase hover:text-neutral-500 transition-colors"
                            >
                              {item.name}
                            </Link>
                            {item.attributes &&
                              Object.keys(item.attributes).length > 0 && (
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 px-2 py-0.5 rounded-full inline-block">
                                  {Object.entries(item.attributes)
                                    .map(([_, value]) => value)
                                    .join(" / ")}
                                </p>
                              )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-300 hover:text-black transition-colors"
                            aria-label="Remove item"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {/* Premium Quantity Selector */}
                          <div className="flex items-center bg-neutral-100 rounded-full p-1 border border-neutral-200/50">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-400 hover:text-black hover:shadow-sm transition-all"
                              aria-label="Decrease quantity"
                            >
                              <svg
                                className="h-2 w-2"
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
                            <span className="w-8 text-center text-[10px] font-black">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                item.maxQuantity
                                  ? item.quantity >= item.maxQuantity
                                  : false
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-400 hover:text-black hover:shadow-sm transition-all disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <svg
                                className="h-2 w-2"
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

                          {/* Price */}
                          <p className="text-sm font-black tracking-tight">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-50 bg-white/80 backdrop-blur-xl px-8 py-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
                      Subtotal
                    </p>
                    <p className="text-2xl font-black tracking-tighter">
                      {formatPrice(total)}
                    </p>
                  </div>
                  <div className="h-px bg-neutral-100 w-full" />
                  <p className="text-[10px] italic text-neutral-400 text-center uppercase tracking-widest">
                    Shipping & taxes calculated at checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Link href="/checkout" onClick={closeCart}>
                    <Button className="w-full h-16 rounded-full bg-black hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98]">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={closeCart}>
                    <Button
                      variant="outline"
                      className="w-full h-16 rounded-full border-neutral-200 hover:bg-neutral-50 text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                      Explore Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
