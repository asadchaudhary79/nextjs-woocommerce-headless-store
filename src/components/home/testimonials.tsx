"use client";

import Image from "next/image";

const testimonials = [
  {
    id: 1,
    text: "The quality of the fabrics is beyond incredible. Every piece I've bought feels timeless and well-crafted. Truly a minimalist's dream.",
    author: "Sarah Jenkins",
    role: "Verified Curator",
    imgId: 32,
  },
  {
    id: 2,
    text: "Minimalist aesthetic done right. Their shipping is faster than expected and the packaging is art itself. Highly recommended.",
    author: "Michael Ross",
    role: "Verified Patron",
    imgId: 44,
  },
  {
    id: 3,
    text: "Finally found a brand that balances high-end style with sustainable practices. The fit and finish are perfect every single time.",
    author: "Elena Wright",
    role: "Fashion Designer",
    imgId: 67,
  },
];

export function Testimonials() {
  return (
    <section className="bg-neutral-50 py-32 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-24 text-[260px] font-black text-black/[0.01] select-none pointer-events-none leading-none -z-0">
        JOURNAL
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-neutral-400">
            Voices
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mt-4 text-neutral-900">
            WHAT THEY <span className="italic font-light">SAY</span>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="flex flex-col gap-10 bg-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.05)] border border-neutral-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-2 group"
            >
              <div className="flex gap-1 text-black opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                {[...Array(5)].map((_, star) => (
                  <svg
                    key={star}
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-2xl font-light italic text-neutral-800 leading-relaxed">
                "{t.text}"
              </blockquote>

              <div className="flex items-center gap-5 mt-auto">
                <div className="w-14 h-14 rounded-full bg-neutral-100 overflow-hidden relative shadow-inner ring-4 ring-neutral-50">
                  <Image
                    src={`https://i.pravatar.cc/150?u=minimalist-${t.id}`}
                    alt={t.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-black text-[11px] tracking-[0.3em] uppercase text-neutral-900">
                    {t.author}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-widest font-bold">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
