import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminHeroSlidesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-white">Hero Slides</h1>
          <p className="mt-2 text-sm text-slate-400">
            Control the storefront slideshow images, headlines, and call-to-action links.
          </p>
        </div>

        <form
          action="/api/hero-slides"
          method="post"
          className="mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 xl:grid-cols-[1.2fr,1.2fr,1.4fr,0.8fr,0.8fr,0.5fr,0.6fr,auto]"
        >
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="title" placeholder="Slide title" required />
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="subtitle" placeholder="Short subtitle" />
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="imageUrl" placeholder="Image URL" required />
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="ctaLabel" placeholder="CTA label" />
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="ctaHref" placeholder="CTA link" />
          <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="sortOrder" placeholder="Sort" type="number" min="0" defaultValue="0" />
          <label className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
            <input className="h-4 w-4 accent-[#ff7a1a]" name="isActive" type="checkbox" value="true" defaultChecked />
            Active
          </label>
          <button className="rounded-full bg-[#ff7a1a] px-5 py-3 font-medium text-white" type="submit">Add Slide</button>
        </form>

        <div className="grid gap-5">
          {slides.map((slide) => (
            <article key={slide.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <form
                id={`slide-update-${slide.id}`}
                action={`/api/hero-slides/${slide.id}`}
                method="post"
                className="grid gap-4 xl:grid-cols-[1fr,1fr,1.4fr,0.8fr,0.8fr,0.5fr,0.6fr,auto,auto]"
              >
                <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="title" defaultValue={slide.title} />
                <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="subtitle" defaultValue={slide.subtitle ?? ""} />
                <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="imageUrl" defaultValue={slide.imageUrl} />
                <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="ctaLabel" defaultValue={slide.ctaLabel ?? ""} />
                <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="ctaHref" defaultValue={slide.ctaHref ?? ""} />
                <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" name="sortOrder" type="number" min="0" defaultValue={slide.sortOrder} />
                <label className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                  <input className="h-4 w-4 accent-[#ff7a1a]" name="isActive" type="checkbox" value="true" defaultChecked={slide.isActive} />
                  Active
                </label>
                <input type="hidden" name="_method" value="PATCH" />
                <button className="w-full rounded-full bg-slate-200 px-5 py-3 font-medium text-slate-900" type="submit">
                  Save
                </button>
              </form>
              <form action={`/api/hero-slides/${slide.id}`} method="post" className="mt-4 flex justify-end">
                <input type="hidden" name="_method" value="DELETE" />
                <button className="rounded-full border border-red-500/30 px-5 py-3 font-medium text-red-300" type="submit">
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
