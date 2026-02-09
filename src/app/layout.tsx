import type { Metadata } from "next";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Providers } from "@/components/providers";
import { wooCommerce } from "@/lib/woocommerce";
import type { WCCategory } from "@/types/woocommerce";

// Clean sans-serif for everything
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

// Slightly more personality for headings
const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "STORE | Premium Fashion",
  description: "Shop premium fashion collections",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: WCCategory[] = [];
  try {
    categories = await wooCommerce.categories.list({
      parent: 0,
      hide_empty: true,
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <html lang="en" className={`${inter.variable} ${karla.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header initialCategories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
