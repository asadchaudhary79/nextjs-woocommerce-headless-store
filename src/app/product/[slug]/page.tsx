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
    title: product.name,
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

async function RelatedProducts({
  product,
}: {
  product: Awaited<ReturnType<typeof wooCommerce.products.getBySlug>>;
}) {
  if (!product || !product.related_ids?.length) return null;

  const relatedProducts = await wooCommerce.products.getRelated(product, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-24 border-t border-gray-100 pt-16">
      <h2 className="mb-12 text-center text-3xl font-light uppercase tracking-widest text-gray-900">
        You May Also Like
      </h2>
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
      {/* Breadcrumbs - Full Width */}
      <Breadcrumbs items={breadcrumbs} className="mb-8" />

      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Product Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <ProductInfo product={product} variations={variations} />
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
    <div className="py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail slug={slug} />
      </Suspense>
    </div>
  );
}
