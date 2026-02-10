"use client";

import Image from "next/image";

const instagramPosts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000",
    likes: "1.2k",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000",
    likes: "2.4k",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1000",
    likes: "890",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000",
    likes: "3.1k",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000",
    likes: "1.5k",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd2229969e?q=80&w=1000",
    likes: "945",
  },
];

export function SocialGallery() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-neutral-100 pb-12">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400">
              Community
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mt-4 text-neutral-900 group">
              @MINIMALIST_
              <span className="italic font-light text-neutral-400 group-hover:text-black transition-colors duration-500">
                STORE
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-neutral-500 font-light text-base md:text-right italic">
              Join over 250k tastemakers sharing their unique{" "}
              <br className="hidden lg:block" /> vision of modern luxury.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden bg-neutral-100 rounded-3xl cursor-pointer"
            >
              <Image
                src={post.image}
                alt={`Social post ${post.id}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-white text-[10px] font-bold tracking-widest">
                  {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
