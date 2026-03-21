"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex] ?? slides[0];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#101a30]">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
      <Image
        src={activeSlide.imageUrl}
        alt={activeSlide.title}
        fill
        priority
        className="object-cover"
        sizes="(min-width: 1280px) 70vw, 100vw"
      />
      <div className="relative flex min-h-[320px] flex-col justify-end p-6 sm:min-h-[380px] sm:p-8 lg:min-h-[430px]">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full bg-[#ff7a1a]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            Marketplace spotlight
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            {activeSlide.title}
          </h1>
          {activeSlide.subtitle ? (
            <p className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base">{activeSlide.subtitle}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={activeSlide.ctaHref || "/shop"}
              className="rounded-full bg-[#ff7a1a] px-5 py-2.5 text-sm font-semibold text-white"
            >
              {activeSlide.ctaLabel || "Shop now"}
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Browse all deals
            </Link>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex ? "w-8 bg-[#ff7a1a]" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
