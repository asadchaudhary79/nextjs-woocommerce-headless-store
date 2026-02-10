import { notFound } from "next/navigation";
import Link from "next/link";
import { wooCommerce } from "@/lib/woocommerce";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, ArrowRight, History } from "lucide-react";

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    notFound();
  }

  let order;
  try {
    order = await wooCommerce.orders.get(orderId);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 lg:px-8">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center space-y-8 mb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-neutral-50 rounded-full scale-[2.5] -z-10 animate-pulse" />
          <div className="h-20 w-20 rounded-full bg-black flex items-center justify-center shadow-2xl">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-neutral-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
            Order Confirmed – Receipt #ARCHIVE-{order.number}
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] max-w-2xl mx-auto">
            Thank you <br />
            <span className="italic text-neutral-300">for your trust.</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 max-w-md mx-auto leading-relaxed">
            Your selection has been registered in our archives and is now being
            meticulously prepared for transit.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Main Details */}
        <div className="lg:col-span-7 space-y-12">
          {/* Items Section */}
          <section className="bg-neutral-50 rounded-4xl p-8 border border-neutral-100">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 mb-8 pb-4 border-b border-neutral-200">
              The Selection
            </h2>
            <div className="space-y-6">
              {order.line_items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center group"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-12 bg-white rounded-xl border border-neutral-100 flex items-center justify-center shrink-0 shadow-sm">
                      <ShoppingBag
                        className="w-5 h-5 text-neutral-200"
                        strokeWidth={1}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black tracking-tighter">
                    {formatPrice(parseFloat(item.total))}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-200 space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-400">
                <span>Sub-investment</span>
                <span>
                  {formatPrice(
                    order.line_items.reduce(
                      (acc: number, item: any) => acc + parseFloat(item.total),
                      0,
                    ),
                  )}
                </span>
              </div>
              {parseFloat(order.shipping_total) > 0 && (
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-400">
                  <span>Logistics</span>
                  <span>{formatPrice(parseFloat(order.shipping_total))}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-black uppercase tracking-tighter pt-4 border-t-2 border-neutral-900 border-dashed">
                <span className="text-neutral-400">Total Archive Value</span>
                <span className="text-black">
                  {formatPrice(parseFloat(order.total))}
                </span>
              </div>
            </div>
          </section>

          {/* Logistics Tracking Map/Placeholder */}
          <div className="relative aspect-video bg-neutral-100 rounded-4xl overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-300">
                Tracking Map Initializing...
              </p>
            </div>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 mb-4">
                Destination
              </h3>
              <address className="not-italic text-[11px] font-bold uppercase tracking-widest leading-relaxed text-neutral-600">
                <span className="text-black font-black">
                  {order.shipping.first_name} {order.shipping.last_name}
                </span>
                <br />
                {order.shipping.address_1}
                <br />
                {order.shipping.city}, {order.shipping.state}{" "}
                {order.shipping.postcode}
                <br />
                {order.shipping.country}
              </address>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 mb-4">
                Payment Basis
              </h3>
              <p className="text-[11px] font-black uppercase tracking-widest">
                {order.payment_method_title}
              </p>
              <p className="mt-2 text-[10px] font-black text-neutral-300 uppercase italic">
                Transaction Secured
              </p>
            </div>
          </div>

          {order.customer_note && (
            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 italic">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 mb-2">
                Instructions
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-bold tracking-tight">
                "{order.customer_note}"
              </p>
            </div>
          )}

          <div className="space-y-4 pt-8">
            <Link href="/shop" className="block">
              <Button className="w-full h-16 rounded-full bg-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl group">
                Back to Archives{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/account/orders" className="block">
              <Button
                variant="outline"
                className="w-full h-16 rounded-full border-2 border-neutral-100 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
              >
                <History className="h-4 w-4" /> View Register
              </Button>
            </Link>
          </div>

          <p className="text-[9px] text-center font-bold uppercase tracking-widest text-neutral-300">
            A confirmation document has been dispatched to {order.billing.email}
          </p>
        </div>
      </div>
    </div>
  );
}
