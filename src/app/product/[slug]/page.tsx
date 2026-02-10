import { Suspense } from "react";
import { notFound } from "next/navigation";
import { wooCommerce } from "@/lib/woocommerce";
import { ProductDetailSkeleton } from "@/components/ui/skeleton";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { Metadata } from "next";
import type { WCProductVariation } from "@/types/woocommerce";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await wooCommerce.products.getBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | WooCommerce Store`,
    description:
      product.short_description?.replace(/<[^>]*>/g, "") ||
      product.description?.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.short_description?.replace(/<[^>]*>/g, ""),
      images: product.images[0]?.src ? [{ url: product.images[0].src }] : [],
    },
  };
}

function ProductFeatures() {
  const features = [
    {
      title: "Free Shipping",
      description: "On all orders over $150",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
    },
    {
      title: "Secure Payment",
      description: "100% secure checkout",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Eco Conscious",
      description: "Sustainable packaging",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 border-y border-gray-100 py-12 md:grid-cols-3">
      {features.map((feature) => (
        <div key={feature.title} className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-900">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

async function RelatedProducts({
  product,
}: {
  product: Awaited<ReturnType<typeof wooCommerce.products.getBySlug>>;
}) {
  if (!product || !product.related_ids?.length) return null;

  const relatedProducts = await wooCommerce.products.getRelated(product, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-24 pt-16">
      <div className="mb-12 flex flex-col items-center justify-center text-center">
        <span className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          Complete the look
        </span>
        <h2 className="text-3xl font-light uppercase tracking-[0.2em] text-gray-900 lg:text-4xl">
          You May Also Like
        </h2>
        <div className="mt-4 h-px w-24 bg-black" />
      </div>
      <ProductGrid products={relatedProducts} columns={4} />
    </section>
  );
}

async function ProductDetail({ slug }: { slug: string }) {
  const product = await wooCommerce.products.getBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch variations if variable product
  let variations: WCProductVariation[] = [];
  if (product.type === "variable" && product.variations.length > 0) {
    variations = await wooCommerce.products.getVariations(product.id);
  }

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    ...(product.categories[0]
      ? [
          {
            label: product.categories[0].name,
            href: `/shop/${product.categories[0].slug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      {/* Breadcrumbs - Elegant Placement */}
      <div className="mb-12 border-b border-gray-100 pb-6">
        <Breadcrumbs items={breadcrumbs} className="text-gray-400" />
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-20">
        {/* Product Gallery - Higher Aspect Ratio / Modern Feel */}
        <div className="mb-12 lg:mb-0">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <ProductInfo product={product} variations={variations} />
        </div>
      </div>

      {/* Trust Features */}
      <div className="mt-24">
        <ProductFeatures />
      </div>

      {/* Related Products */}
      <Suspense fallback={null}>
        <RelatedProducts product={product} />
      </Suspense>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="relative overflow-hidden bg-white py-12">
      {/* Subtle background decoration */}
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-50/50 blur-3xl" />
      <div className="absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gray-50/30 blur-3xl" />

      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail slug={slug} />
      </Suspense>
    </div>
  );
}
