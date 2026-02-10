"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useIsAuthenticated, useAuthToken } from "@/stores/auth-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ChevronRight,
  Package,
  Clock,
  History,
} from "lucide-react";
import type { WCOrder } from "@/types/woocommerce";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  processing: "bg-blue-50 text-blue-700 border-blue-100",
  "on-hold": "bg-orange-50 text-orange-700 border-orange-100",
  completed: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-neutral-50 text-neutral-500 border-neutral-100",
  refunded: "bg-purple-50 text-purple-700 border-purple-100",
  failed: "bg-red-50 text-red-700 border-red-100",
};

const statusLabels: Record<string, string> = {
  pending: "Archive Pending",
  processing: "Processing Archive",
  "on-hold": "Awaiting Protocol",
  completed: "Archive Complete",
  cancelled: "Voided",
  refunded: "Reversed",
  failed: "Transmission Fault",
};

export default function OrdersPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const token = useAuthToken();

  const [orders, setOrders] = useState<WCOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/account/login?redirect=/account/orders");
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated && token) {
      fetchOrders();
    }
  }, [mounted, isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/account/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 lg:px-8">
      {/* Editorial Header */}
      <div className="mb-16 space-y-6">
        <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">
          <Link href="/account" className="hover:text-black transition-colors">
            Register
          </Link>
          <span className="text-neutral-100">/</span>
          <span className="text-black">Archives</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-neutral-50 pb-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
              Order <br />
              <span className="italic text-neutral-300">Archives</span>
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 max-w-md leading-relaxed">
              Consult the chronological record of your acquired selections and
              their current logistical status.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-neutral-50 px-6 py-4 rounded-3xl border border-neutral-100 shadow-sm">
            <History className="w-5 h-5 text-neutral-200" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300">
                Record Count
              </p>
              <p className="text-sm font-black tracking-tight">
                {orders.length} Entries
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-48 bg-neutral-50 rounded-4xl border border-neutral-100"
              />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-red-50 p-8 text-[11px] font-black uppercase tracking-widest text-red-600 border border-red-100"
          >
            Transmission Error: {error}
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-neutral-50 rounded-4xl border border-neutral-100 overflow-hidden relative"
          >
            <div className="relative z-10 space-y-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white rounded-full scale-[2] -z-10 opacity-50" />
                <ShoppingBag
                  className="mx-auto h-16 w-16 text-neutral-200"
                  strokeWidth={1}
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase">
                  Records Empty
                </h2>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 max-w-xs mx-auto">
                  No acquisitions have been registered to this account yet.
                </p>
              </div>
              <Link href="/shop" className="block pt-4">
                <Button className="h-16 px-12 rounded-full bg-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl">
                  Begin Exploration
                </Button>
              </Link>
            </div>
            {/* Abstract Background Element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 border-2 border-neutral-100 rounded-full opacity-20 pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white border border-neutral-100 rounded-4xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-neutral-100 hover:border-neutral-200 overflow-hidden"
              >
                {/* Visual Accent */}
                <div
                  className={`absolute top-0 left-0 w-2 h-full transition-colors duration-500 ${
                    order.status === "completed"
                      ? "bg-green-400"
                      : "bg-neutral-100 group-hover:bg-black"
                  }`}
                />

                <div className="grid md:grid-cols-4 gap-8">
                  {/* Order Meta */}
                  <div className="space-y-4 md:col-span-1">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300 italic">
                        Reference
                      </p>
                      <p className="text-xl font-black tracking-tighter">
                        #{order.number}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        statusColors[order.status] ||
                        "bg-neutral-50 text-neutral-500"
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>

                  {/* Date & Items */}
                  <div className="space-y-4 md:col-span-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300 italic flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Timestamp
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-black">
                          {new Date(order.date_created).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300 italic flex items-center gap-2">
                          <Package className="w-3 h-3" /> Volume
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-black">
                          {order.line_items.length} Curated Item
                          {order.line_items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-200 mb-2 italic">
                        Selection Preview
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.line_items.slice(0, 4).map((item, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-black uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded text-neutral-400 group-hover:bg-neutral-100 group-hover:text-black transition-colors"
                          >
                            {item.name}
                          </span>
                        ))}
                        {order.line_items.length > 4 && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-300">
                            +{order.line_items.length - 4} More
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Link */}
                  <div className="flex flex-col justify-between items-end md:col-span-1">
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300 italic">
                        Investment
                      </p>
                      <p className="text-2xl font-black tracking-tighter">
                        {formatPrice(parseFloat(order.total))}
                      </p>
                    </div>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:underline underline-offset-8 decoration-2 decoration-neutral-100 hover:decoration-black transition-all"
                    >
                      Examine Details{" "}
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
